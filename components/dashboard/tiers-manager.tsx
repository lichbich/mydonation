"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upsertTier, deleteTier } from "@/lib/actions/dashboard/tiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const TierSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    priceMonthly: z.number().min(0),
    perksString: z.string().optional(), // Helper for textarea input
    isActive: z.boolean(),
});

type TierFormData = z.infer<typeof TierSchema>;

interface TiersManagerProps {
    initialData: any[];
}

export function TiersManager({ initialData }: TiersManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<TierFormData>({
        resolver: zodResolver(TierSchema),
        defaultValues: {
            title: "",
            description: "",
            priceMonthly: 50000,
            perksString: "",
            isActive: true,
        },
    });

    const handleOpen = (item?: any) => {
        setEditingItem(item || null);
        if (item) {
            // Convert perks array to string for textarea
            let perksStr = "";
            try {
                const p = typeof item.perks === 'string' ? JSON.parse(item.perks) : item.perks;
                if (Array.isArray(p)) perksStr = p.join("\n");
            } catch (e) { }

            form.reset({
                id: item.id,
                title: item.title,
                description: item.description || "",
                priceMonthly: item.priceMonthlyCents, // assuming logic handled in action
                perksString: perksStr,
                isActive: item.isActive,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                priceMonthly: 50000,
                perksString: "",
                isActive: true,
            });
        }
        setIsOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof TierSchema>) => {
        setIsLoading(true);
        // Convert perksString back to array
        const perks = values.perksString
            ? values.perksString.split('\n').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        // Construct payload manually because schema for action expects perks array
        const payload = {
            ...values,
            perks,
        };

        const res = await upsertTier(payload);
        setIsLoading(false);
        if (res.success) {
            toast.success(editingItem ? "Cập nhật thành công" : "Tạo gói thành công");
            setIsOpen(false);
            router.refresh();
        } else {
            toast.error(res.error || "Có lỗi sảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa gói này không?")) return;
        toast.promise(deleteTier(id), {
            loading: 'Đang xóa...',
            success: () => { router.refresh(); return 'Đã xóa thành công'; },
            error: 'Lỗi khi xóa'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Các Gói Membership</h2>
                <Button onClick={() => handleOpen()} className="bg-primary">
                    <Plus className="mr-2 h-4 w-4" /> Tạo Gói Mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialData.map((item) => {
                    let perks = [];
                    try { perks = typeof item.perks === 'string' ? JSON.parse(item.perks) : item.perks; } catch (e) { }

                    return (
                        <Card key={item.id} className={`flex flex-col ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{item.title}</CardTitle>
                                    {!item.isActive && <Badge variant="outline">Đã ẩn</Badge>}
                                </div>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(item.priceMonthlyCents)}<span className="text-sm font-normal text-muted-foreground">/tháng</span></p>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <div className="space-y-2">
                                    {perks.map((perk: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            <span>{perk}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                <Button variant="outline" size="sm" onClick={() => handleOpen(item)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Sửa
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Sửa Gói Membership" : "Tạo Gói Mới"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên gói</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Fan Cứng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priceMonthly"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá tháng (VND)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả ngắn</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Mô tả chung..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="perksString"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đặc quyền (Mỗi dòng 1 cái)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`Xem bài viết độc quyền\nTham gia Group kín\n...`}
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Xuống dòng để thêm quyền lợi mới</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Kích hoạt</FormLabel>
                                            <p className="text-xs text-muted-foreground">Hiển thị công khai gói này</p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Lưu
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
