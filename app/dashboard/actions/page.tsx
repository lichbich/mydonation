import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";

export const metadata = {
    title: "Action Cards - Dashboard",
};

export default function DashboardActionsPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Action Cards</h1>
                    <p className="text-muted-foreground">
                        Tạo và quản lý các Action Cards để nhận ủng hộ
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Card
                </Button>
            </div>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Chưa có Action Card</h3>
                    <p className="text-muted-foreground mb-4">
                        Tạo Action Card đầu tiên để supporters có thể ủng hộ bạn
                    </p>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo Action Card
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
