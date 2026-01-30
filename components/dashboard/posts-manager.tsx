"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { upsertPost, deletePost } from "@/lib/actions/dashboard/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Eye, Lock } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const PostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    visibility: z.enum(["PUBLIC", "MEMBERS"]),
});

type PostFormData = z.infer<typeof PostSchema>;

interface PostsManagerProps {
    initialData: any[];
}

export function PostsManager({ initialData }: PostsManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<PostFormData>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: "",
            content: "",
            visibility: "PUBLIC",
        },
    });

    const handleOpen = (item?: any) => {
        setEditingItem(item || null);
        if (item) {
            form.reset({
                id: item.id,
                title: item.title,
                content: item.content,
                visibility: item.visibility,
            });
        } else {
            form.reset({
                title: "",
                content: "",
                visibility: "PUBLIC",
            });
        }
        setIsOpen(true);
    };

    const onSubmit = async (values: z.infer<typeof PostSchema>) => {
        setIsLoading(true);
        const res = await upsertPost(values);
        setIsLoading(false);
        if (res.success) {
            toast.success(editingItem ? "Cập nhật bài viết thành công" : "Đăng bài mới thành công");
            setIsOpen(false);
            router.refresh();
        } else {
            toast.error(res.error || "Có lỗi sảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

        toast.promise(deletePost(id), {
            loading: 'Đang xóa...',
            success: () => {
                router.refresh();
                return 'Đã xóa thành công';
            },
            error: 'Lỗi khi xóa'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Danh sách Bài viết</h2>
                <Button onClick={() => handleOpen()} className="bg-primary">
                    <Plus className="mr-2 h-4 w-4" /> Viết Bài Mới
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead className="w-[120px]">Trạng thái</TableHead>
                            <TableHead className="w-[150px]">Ngày đăng</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    Chưa có bài viết nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="max-w-[300px] truncate" title={item.title}>
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.visibility === 'PUBLIC' ? 'secondary' : 'default'} className={item.visibility === 'MEMBERS' ? 'bg-amber-500' : ''}>
                                            {item.visibility === 'PUBLIC' ? <Eye className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
                                            {item.visibility}
                                        </Badge>
                                    </TableCell>
                                    <TableCell suppressHydrationWarning>
                                        {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Chỉnh sửa Bài viết" : "Viết Bài Mới"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-[1fr_200px] gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiêu đề</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tiêu đề..." {...field} />
                                            </FormControl>
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
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn chế độ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PUBLIC">Công khai (Public)</SelectItem>
                                                    <SelectItem value="MEMBERS">Chỉ Members (Premium)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nội dung (Markdown)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Viết nội dung bài viết tại đây (hỗ trợ Markdown)..."
                                                className="min-h-[300px] font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingItem ? "Lưu thay đổi" : "Đăng bài"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
