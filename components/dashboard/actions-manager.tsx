"use client";
// @ts-nocheck - Complex type inference with zod and react-hook-form

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upsertActionCard, deleteActionCard, toggleFeaturedActionCard } from "@/lib/actions/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ActionCardSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    price: z.number().min(0, "Giá không hợp lệ").max(2000000000, "Giá quá lớn (tối đa 2 tỷ)"),
    icon: z.string().optional(),
    isFeatured: z.boolean(),
});

type ActionCardFormData = z.infer<typeof ActionCardSchema>;

interface ActionsManagerProps {
    initialData: any[];
}

export function ActionsManager({ initialData }: ActionsManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ActionCardFormData>({
        resolver: zodResolver(ActionCardSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 50000,
            icon: "☕",
            isFeatured: false,
        },
    });

    const handleOpen = (item?: any) => {
        setEditingItem(item || null);
        if (item) {
            form.reset({
                id: item.id,
                title: item.title,
                description: item.description || "",
                price: item.price,
                icon: item.icon || "☕",
                isFeatured: item.isFeatured,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                price: 50000,
                icon: "☕",
                isFeatured: false,
            });
        }
        setIsOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof ActionCardSchema>) => {
        setIsLoading(true);
        const res = await upsertActionCard(values);
        setIsLoading(false);
        if (res.success) {
            toast.success(editingItem ? "Cập nhật thành công" : "Đã tạo mới Action Card");
            setIsOpen(false);
            router.refresh(); // Refresh list
        } else {
            toast.error(res.error || "Có lỗi sảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa Card này không?")) return;

        // Optimistic UI could be used here, but simple refresh is fine for MVP
        toast.promise(deleteActionCard(id), {
            loading: 'Đang xóa...',
            success: () => {
                router.refresh();
                return 'Đã xóa thành công';
            },
            error: 'Lỗi khi xóa'
        });
    };

    const handleToggleFeatured = async (id: string) => {
        await toggleFeaturedActionCard(id);
        toast.success("Đã cập nhật trạng thái nổi bật");
        router.refresh();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Danh sách Action Cards</h2>
                <Button onClick={() => handleOpen()} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Tạo Mới
                </Button>
            </div>

            {initialData.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 border border-dashed rounded-xl">
                    <p className="text-muted-foreground mb-4">Chưa có Action Card nào.</p>
                    <Button variant="outline" onClick={() => handleOpen()}>Tạo cái đầu tiên</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialData.map((item) => (
                        <Card key={item.id} className={`relative flex flex-col ${item.isFeatured ? 'border-primary/50 bg-primary/5' : ''}`}>
                            {item.isFeatured && (
                                <div className="absolute top-2 right-2 text-primary">
                                    <Star className="h-4 w-4 fill-primary" />
                                </div>
                            )}
                            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                                <span className="text-2xl">{item.icon}</span>
                                <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-xl font-bold text-primary mb-2">{formatCurrency(item.price)}</p>
                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                    {item.description}
                                </p>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(item.id)}>
                                    {item.isFeatured ? "Bỏ nổi bật" : "Nổi bật"}
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpen(item)} aria-label="Chỉnh sửa">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)} aria-label="Xóa">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Chỉnh sửa Action Card" : "Tạo Action Card Mới"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon (Emoji)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="☕" {...field} className="text-xl w-16 text-center" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên gói</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cafe sáng" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá (VND)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                step={1000}
                                                value={field.value}
                                                onChange={(e) => {
                                                    const value = e.target.valueAsNumber;
                                                    field.onChange(isNaN(value) ? 0 : value);
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
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
                                            <Textarea placeholder="Mô tả lợi ích..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Nổi bật</FormLabel>
                                            <p className="text-xs text-muted-foreground">Hiển thị đầu tiên trên profile</p>
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
                                    {editingItem ? "Lưu thay đổi" : "Tạo mới"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
