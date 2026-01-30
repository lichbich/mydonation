"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upsertGalleryItem, deleteGalleryItem } from "@/lib/actions/dashboard/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon, PlayCircle, Eye, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const GallerySchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().url("URL không hợp lệ"),
    type: z.enum(["IMAGE", "VIDEO"]),
    visibility: z.enum(["PUBLIC", "MEMBERS"]),
});

interface GalleryManagerProps {
    initialData: any[];
}

export function GalleryManager({ initialData }: GalleryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof GallerySchema>>({
        resolver: zodResolver(GallerySchema),
        defaultValues: {
            title: "",
            url: "",
            type: "IMAGE",
            visibility: "PUBLIC",
        },
    });

    const handleOpen = (item?: any) => {
        setEditingItem(item || null);
        if (item) {
            form.reset({
                id: item.id,
                title: item.title || "",
                url: item.url,
                type: item.type,
                visibility: item.visibility,
            });
        } else {
            form.reset({
                title: "",
                url: "",
                type: "IMAGE",
                visibility: "PUBLIC",
            });
        }
        setIsOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof GallerySchema>) => {
        setIsLoading(true);
        const res = await upsertGalleryItem(values);
        setIsLoading(false);
        if (res.success) {
            toast.success(editingItem ? "Cập nhật thành công" : "Thêm mới thành công");
            setIsOpen(false);
            router.refresh();
        } else {
            toast.error(res.error || "Có lỗi sảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;
        toast.promise(deleteGalleryItem(id), {
            loading: 'Đang xóa...',
            success: () => { router.refresh(); return 'Đã xóa thành công'; },
            error: 'Lỗi khi xóa'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Thư Viện Ảnh/Video</h2>
                <Button onClick={() => handleOpen()} className="bg-primary">
                    <Plus className="mr-2 h-4 w-4" /> Thêm Mới
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {initialData.map((item) => (
                    <div key={item.id} className="relative group rounded-lg overflow-hidden border bg-background aspect-square">
                        <img src={item.url} alt={item.title || "Gallery"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-sm font-medium truncate mb-2">{item.title || "Untitled"}</p>
                            <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1">
                                    {item.visibility === 'MEMBERS' ? <Lock className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                                    {item.visibility}
                                </Badge>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:text-white hover:bg-white/20" onClick={() => handleOpen(item)}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-400 hover:bg-red-500/20" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="bg-background/80 backdrop-blur border-none">
                                {item.type === 'VIDEO' ? <PlayCircle className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Chỉnh sửa Gallery" : "Thêm Ảnh/Video"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Ảnh/Video</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="IMAGE">Hình ảnh</SelectItem>
                                                    <SelectItem value="VIDEO">Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="visibility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hiển thị</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PUBLIC">Công khai</SelectItem>
                                                    <SelectItem value="MEMBERS">Members Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tiêu đề (Tùy chọn)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mùa hè xanh..." {...field} />
                                        </FormControl>
                                        <FormMessage />
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
