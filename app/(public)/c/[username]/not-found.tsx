import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

export default function CreatorNotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                    <UserX className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Creator Không Tồn Tại</h1>
                <p className="text-muted-foreground mb-6">
                    Không tìm thấy creator này. Có thể họ đã thay đổi username hoặc tài khoản đã bị xóa.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" asChild>
                        <Link href="/">Trang Chủ</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/explore">Khám Phá</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
