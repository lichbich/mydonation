import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, TrendingUp, CreditCard } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard/stats";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    const data = await getDashboardStats();

    const stats = [
        {
            label: "Donations",
            value: data?.totalDonations?.toString() || "0",
            icon: Heart,
            color: "text-primary"
        },
        {
            label: "Supporters",
            value: data?.supporterCount?.toString() || "0",
            icon: Users,
            color: "text-pink-500"
        },
        {
            label: "Thu Nhập",
            value: formatCurrency(data?.totalEarnings || 0),
            icon: TrendingUp,
            color: "text-green-500"
        },
        {
            label: "Action Cards",
            value: data?.actionCardsCount?.toString() || "0",
            icon: CreditCard,
            color: "text-purple-500"
        },
    ];

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Chào mừng, <span className="font-medium">{session.user.name}</span>!
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Hoạt Động Gần Đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {data.recentTransactions.map((tx: any) => (
                                    <div key={tx.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg">{tx.actionCard?.icon || "💝"}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {tx.fan?.name || tx.guestName || "Ẩn danh"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {tx.actionCard?.title || "Ủng hộ"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">
                                                +{formatCurrency(tx.amountCents)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(tx.createdAt), {
                                                    addSuffix: true,
                                                    locale: vi
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Chưa có hoạt động nào</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông Tin Nhanh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Tổng thu nhập</span>
                                <span className="font-bold text-green-600">
                                    {formatCurrency(data?.totalEarnings || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Số người ủng hộ</span>
                                <span className="font-bold">{data?.supporterCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Tổng donations</span>
                                <span className="font-bold">{data?.totalDonations || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

