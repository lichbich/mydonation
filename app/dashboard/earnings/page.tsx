import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getEarningsData } from "@/lib/actions/dashboard/earnings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, Users, Heart, Calendar, Wallet } from "lucide-react";

export const metadata = {
    title: "Thu Nhập | Dashboard",
    description: "Xem thống kê thu nhập và danh sách người ủng hộ",
};

function formatCurrency(cents: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cents);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export default async function EarningsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    if ((session.user as any).role !== "CREATOR") {
        redirect("/dashboard");
    }

    const data = await getEarningsData();

    if (!data) {
        return (
            <div className="p-6 lg:p-8">
                <p className="text-muted-foreground">Không thể tải dữ liệu</p>
            </div>
        );
    }

    const { transactions, stats, topSupporters } = data;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Thu Nhập</h1>
                <p className="text-muted-foreground">
                    Tổng quan thu nhập và danh sách người ủng hộ của bạn
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Wallet className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
                                <p className="text-sm text-muted-foreground">Tổng thu nhập</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.monthlyAmount)}</p>
                                <p className="text-sm text-muted-foreground">Tháng này</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-pink-500/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Heart className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalDonations}</p>
                                <p className="text-sm text-muted-foreground">Lượt ủng hộ</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border-purple-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600">{stats.uniqueSupporters}</p>
                                <p className="text-sm text-muted-foreground">Supporters</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-primary" />
                            Lịch Sử Ủng Hộ
                        </CardTitle>
                        <CardDescription>Các khoản ủng hộ gần đây</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Chưa có khoản ủng hộ nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={tx.fan?.image || ""} />
                                            <AvatarFallback className="bg-primary/20 text-primary">
                                                {tx.fan?.name?.charAt(0) || tx.guestName?.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">
                                                    {tx.isAnonymous ? "Ẩn danh" : tx.fan?.name || tx.guestName || "Khách"}
                                                </p>
                                                {tx.actionCard && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {tx.actionCard.icon} {tx.actionCard.title}
                                                    </Badge>
                                                )}
                                            </div>
                                            {tx.message && (
                                                <p className="text-sm text-muted-foreground truncate mt-1">
                                                    "{tx.message}"
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(tx.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">+{formatCurrency(tx.amountCents)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Supporters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-500" />
                            Top Supporters
                        </CardTitle>
                        <CardDescription>Những người ủng hộ nhiều nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topSupporters.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Chưa có supporters</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topSupporters.map((supporter, index) => (
                                    <div key={supporter.fanId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={supporter.fan?.image || ""} />
                                                <AvatarFallback>
                                                    {supporter.fan?.name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            {index < 3 && (
                                                <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{supporter.fan?.name || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {supporter._count.id} lần ủng hộ
                                            </p>
                                        </div>
                                        <p className="font-semibold text-green-600 text-sm">
                                            {formatCurrency(supporter._sum.amountCents || 0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
