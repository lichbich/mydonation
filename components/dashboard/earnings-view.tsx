"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface EarningsViewProps {
    data: any;
}

export function EarningsView({ data }: EarningsViewProps) {
    if (!data) return <div>Không có dữ liệu.</div>;

    const { totalAllTime, total30d, recentTransactions, chartData } = data;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thu nhập (30 ngày)</CardTitle>
                        <span className="text-muted-foreground">💰</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(total30d)}</div>
                        <p className="text-xs text-muted-foreground">
                            +10% so với tháng trước (giả lập)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thu nhập (Tất cả)</CardTitle>
                        <span className="text-muted-foreground">🏆</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalAllTime)}</div>
                    </CardContent>
                </Card>
                {/* Add more cards like "Số giao dịch", "Average Donation" if needed */}
            </div>

            {/* Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Biểu đồ thu nhập (30 ngày qua)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => format(new Date(val), 'dd/MM')}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    formatter={(val: any) => formatCurrency(val as number)}
                                    labelFormatter={(label: any) => format(new Date(label), 'dd/MM/yyyy')}
                                />
                                <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Giao dịch gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người ủng hộ</TableHead>
                                <TableHead>Số tiền</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thời gian</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Chưa có giao dịch nào.</TableCell>
                                </TableRow>
                            ) : (
                                recentTransactions.map((t: any) => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <div className="font-medium">{t.guestName || "Thành viên"}</div>
                                            <div className="text-xs text-muted-foreground">{t.message || "Không có lời nhắn"}</div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(t.amountCents)}</TableCell>
                                        <TableCell>
                                            <Badge variant={t.status === 'SUCCESS' ? 'default' : 'secondary'} className={t.status === 'SUCCESS' ? 'bg-green-600' : ''}>
                                                {t.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground text-sm">
                                            {format(new Date(t.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
