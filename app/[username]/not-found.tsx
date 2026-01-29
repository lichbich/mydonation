import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";

export default function CreatorNotFound() {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                        <UserX className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Creator Không Tồn Tại</h1>
                    <p className="text-muted-foreground mb-6">
                        Không tìm thấy creator này hoặc họ chưa kích hoạt trang cá nhân.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" asChild>
                            <Link href="/">Về Trang Chủ</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/explore">Khám Phá Creators</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
