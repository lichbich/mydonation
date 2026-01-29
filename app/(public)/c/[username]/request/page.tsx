import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const metadata = {
    title: "Gửi Yêu Cầu",
};

export default function CreatorRequestPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gửi Yêu Cầu</h2>

            {/* Coming Soon */}
            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Sắp Ra Mắt</h3>
                    <p className="text-muted-foreground">
                        Tính năng gửi yêu cầu đang được phát triển
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
