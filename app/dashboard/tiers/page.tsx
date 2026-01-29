import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Crown } from "lucide-react";

export const metadata = {
    title: "Membership Tiers - Dashboard",
};

export default function DashboardTiersPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Membership Tiers</h1>
                    <p className="text-muted-foreground">
                        Tạo các gói membership với quyền lợi đặc biệt
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Tier
                </Button>
            </div>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Chưa có Membership Tier</h3>
                    <p className="text-muted-foreground mb-4">
                        Tạo các tier để xây dựng cộng đồng supporters trung thành
                    </p>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo Tier Đầu Tiên
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
