import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const metadata = {
    title: "Yêu Cầu - Dashboard",
};

export default function DashboardRequestsPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Yêu Cầu</h1>
                <p className="text-muted-foreground">
                    Quản lý các yêu cầu từ supporters
                </p>
            </div>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Chưa có yêu cầu</h3>
                    <p className="text-muted-foreground">
                        Khi supporters gửi yêu cầu, chúng sẽ xuất hiện ở đây
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
