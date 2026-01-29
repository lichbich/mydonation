import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart } from "lucide-react";

export const metadata = {
    title: "Thanh Toán Thành Công",
};

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md relative z-10 border-green-500/50">
                <CardContent className="pt-8 pb-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Thanh Toán Thành Công!</h1>
                    <p className="text-muted-foreground mb-6">
                        Cảm ơn bạn đã ủng hộ creator. Đóng góp của bạn rất có ý nghĩa!
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button asChild>
                            <Link href="/explore">
                                <Heart className="mr-2 h-4 w-4" />
                                Khám Phá Thêm
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Về Trang Chủ</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
