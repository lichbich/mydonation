import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export const metadata = {
    title: "Bài Viết - Dashboard",
};

export default function DashboardPostsPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Bài Viết</h1>
                    <p className="text-muted-foreground">
                        Quản lý bài viết của bạn
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Bài Viết
                </Button>
            </div>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Chưa có bài viết</h3>
                    <p className="text-muted-foreground mb-4">
                        Tạo bài viết đầu tiên để chia sẻ với supporters
                    </p>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo Bài Viết Đầu Tiên
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
