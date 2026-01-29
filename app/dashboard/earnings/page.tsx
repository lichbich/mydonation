import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from "lucide-react";

export const metadata = {
    title: "Thu Nhập - Dashboard",
};

export default function DashboardEarningsPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Thu Nhập</h1>
                    <p className="text-muted-foreground">
                        Theo dõi thu nhập và rút tiền
                    </p>
                </div>
                <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Rút Tiền
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Số Dư</p>
                                <p className="text-2xl font-bold">₫0</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tháng Này</p>
                                <p className="text-2xl font-bold">₫0</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng Thu Nhập</p>
                                <p className="text-2xl font-bold">₫0</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lịch Sử Giao Dịch</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Chưa có giao dịch nào</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
