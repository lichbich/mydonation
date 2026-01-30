import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function Paywall({ tier, creatorName, creatorUsername }: { tier?: any, creatorName: string, creatorUsername: string }) {
    return (
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <CardContent className="flex flex-col items-center justify-center p-12 text-center relative z-10">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
                    <Lock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Nội Dung Dành Riêng Cho Members</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                    Bài viết này chỉ dành cho thành viên của cộng đồng {creatorName}. Hãy đăng ký Membership để mở khóa nội dung này và nhiều đặc quyền khác.
                </p>

                {tier ? (
                    <div className="bg-background/80 backdrop-blur rounded-xl p-6 border border-border/50 max-w-sm w-full mb-8 shadow-sm">
                        <h3 className="font-bold text-lg mb-1">{tier.title}</h3>
                        <p className="text-primary font-bold text-2xl mb-4">{formatCurrency(tier.priceMonthlyCents)} / tháng</p>
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                            <Link href={`/c/${creatorUsername}/membership`}>
                                Đăng Ký Ngay
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <Button variant="default" asChild className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                        <Link href={`/c/${creatorUsername}/membership`}>
                            Xem Các Gói Membership
                        </Link>
                    </Button>
                )}

                <p className="text-xs text-muted-foreground mt-4">
                    Đã là thành viên? <Link href="/auth/login" className="underline hover:text-primary">Đăng nhập</Link>
                </p>
            </CardContent>
        </Card>
    );
}
