"use client";

import { useState } from "react";
import { updateRequestStatus } from "@/lib/actions/dashboard/requests";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

interface RequestsManagerProps {
    initialData: any[];
}

const statusMap: any = {
    "NEW": { label: "Mới", color: "bg-blue-500" },
    "IN_PROGRESS": { label: "Đang làm", color: "bg-amber-500" },
    "DONE": { label: "Hoàn thành", color: "bg-green-500" },
    "REJECTED": { label: "Từ chối", color: "bg-red-500" },
};

export function RequestsManager({ initialData }: RequestsManagerProps) {
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const router = useRouter();

    const handleViewDetail = (req: any) => {
        setSelectedRequest(req);
        setIsDetailOpen(true);
    };

    const handleStatusChange = async (id: string, newStatus: any) => {
        const res = await updateRequestStatus(id, newStatus);
        if (res.success) {
            toast.success("Cập nhật trạng thái thành công");
            router.refresh();
            if (selectedRequest && selectedRequest.id === id) {
                setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
        } else {
            toast.error("Lỗi cập nhật");
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Người gửi</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Ngân sách</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Ngày gửi</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Chưa có yêu cầu nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((req) => (
                                <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetail(req)}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {req.fan ? (
                                                <>
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={req.fan.image} />
                                                        <AvatarFallback>{req.fan.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{req.fan.name}</span>
                                                        <span className="text-xs text-muted-foreground">@{req.fan.username}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{req.guestName || "Guest"}</span>
                                                    <span className="text-xs text-muted-foreground">{req.guestEmail || "No Email"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{req.type}</TableCell>
                                    <TableCell className="font-mono">{formatCurrency(req.budgetCents)}</TableCell>
                                    <TableCell>
                                        <Badge className={`${statusMap[req.status]?.color || 'bg-gray-500'} hover:opacity-80`}>
                                            {statusMap[req.status]?.label || req.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        {format(new Date(req.createdAt), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Xem</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết Yêu cầu</DialogTitle>
                        <DialogDescription>ID: {selectedRequest?.id}</DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Loại yêu cầu</h4>
                                    <p className="font-medium">{selectedRequest.type}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Ngân sách</h4>
                                    <p className="font-bold text-primary">{formatCurrency(selectedRequest.budgetCents)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Người gửi</h4>
                                    <p>{selectedRequest.fan?.name || selectedRequest.guestName || "Ẩn danh"}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.fan?.email || selectedRequest.guestEmail}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Deadline</h4>
                                    <p>{selectedRequest.deadline ? format(new Date(selectedRequest.deadline), 'dd/MM/yyyy') : "Không có"}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Mô tả chi tiết</h4>
                                <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                                    {selectedRequest.description}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Cập nhật trạng thái:</span>
                                    <Select
                                        defaultValue={selectedRequest.status}
                                        onValueChange={(val) => handleStatusChange(selectedRequest.id, val)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">Mới</SelectItem>
                                            <SelectItem value="IN_PROGRESS">Đang làm</SelectItem>
                                            <SelectItem value="DONE">Hoàn thành</SelectItem>
                                            <SelectItem value="REJECTED">Từ chối</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedRequest.guestEmail && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`mailto:${selectedRequest.guestEmail}?subject=Reply to Request ${selectedRequest.id}`}>
                                            Gửi Email
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
