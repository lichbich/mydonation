"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { createRequest } from "@/lib/actions/requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    type: z.string().min(1, "Vui lòng chọn loại yêu cầu"),
    budget: z.number().min(50000, "Ngân sách tối thiểu 50.000đ"),
    deadline: z.date().optional(),
    description: z.string().min(30, "Mô tả cần chi tiết hơn (tối thiểu 30 ký tự)"),
    contactEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    guestName: z.string().optional(),
    isGuest: z.boolean(),
});

type RequestFormData = z.infer<typeof formSchema>;

export function RequestCreationForm({ creatorUsername }: { creatorUsername: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<RequestFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            budget: 500000, // Default 500k
            description: "",
            contactEmail: "",
            guestName: "",
            isGuest: false,
        },
    });

    const isGuest = form.watch("isGuest");

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("type", values.type);
            formData.append("budget", values.budget.toString());
            if (values.deadline) {
                formData.append("deadline", values.deadline.toISOString());
            }
            formData.append("description", values.description);

            if (values.contactEmail) formData.append("contactEmail", values.contactEmail);
            if (values.guestName) formData.append("guestName", values.guestName);

            // Call server action directly (without useFormState for simpler toast handling)
            // Note: createRequest signature expect (username, prevState, formData). 
            // We adapt it or change action signature. 
            // The previous action was designed for useFormState.
            // Let's call it manually:

            const result = await createRequest(creatorUsername, {}, formData);

            if (result.success) {
                toast.success("Gửi yêu cầu thành công!");
                router.push(`/c/${creatorUsername}/requests/success?id=${result.requestId}`);
            } else if (result.errors) {
                // Map errors back to form? Or just show toast
                toast.error("Vui lòng kiểm tra lại thông tin");
                console.log(result.errors);
            } else {
                toast.error(result.message || "Có lỗi xảy ra");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại dịch vụ</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại yêu cầu" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="COMMISSION">Commission (Vẽ/Viết)</SelectItem>
                                        <SelectItem value="SHOUTOUT">Video Shoutout</SelectItem>
                                        <SelectItem value="FAN_CONSULT">Tư vấn 1:1</SelectItem>
                                        <SelectItem value="OTHER">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngân sách dự kiến (VND)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="number" {...field} className="pl-4 font-mono" />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground text-sm">
                                            VND
                                        </div>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Tối thiểu {formatCurrency(50000)}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Hạn chót (Deadline) - Tùy chọn</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP", { locale: vi })
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả chi tiết yêu cầu</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Hãy mô tả rõ ý tưởng, style, kích thước, hoặc nội dung bạn mong muốn..."
                                    className="min-h-[150px] resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                {field.value.length} ký tự (Tối thiểu 30)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4 rounded-lg border border-border/50 bg-muted/20 p-4">
                    <FormField
                        control={form.control}
                        name="isGuest"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Đặt dưới danh nghĩa Guest (Khách vãng lai)
                                    </FormLabel>
                                    <FormDescription>
                                        Nếu bạn chưa đăng nhập, vui lòng điền email liên hệ.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    {isGuest && (
                        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-top-2">
                            <FormField
                                control={form.control}
                                name="guestName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên hiển thị</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tên của bạn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email liên hệ (*)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full md:w-auto" size="lg">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" />
                    Gửi Yêu Cầu
                </Button>
            </form>
        </Form>
    );
}
