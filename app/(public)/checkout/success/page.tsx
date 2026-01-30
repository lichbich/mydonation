import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { confirmTransaction } from "@/lib/actions/donations";
import { Suspense } from "react";

interface PageProps {
    searchParams: Promise<{ tid?: string }>;
}

async function SuccessContent({ tid }: { tid?: string }) {
    if (tid) {
        await confirmTransaction(tid);
    }

    return (
        <div className="max-w-md w-full text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto animate-bounce-subtle">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Thanh Toán Thành Công!</h1>
                <p className="text-muted-foreground">
                    Cảm ơn bạn đã ủng hộ Creator. Giao dịch {tid ? `#${tid.slice(-6)}` : ''} đã được ghi nhận.
                </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                    <Link href="/">Về Trang Chủ</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/explore">Tiếp Tục Khám Phá</Link>
                </Button>
            </div>
        </div>
    );
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
    const { tid } = await searchParams;

    return (
        <div className="container min-h-screen flex items-center justify-center py-20">
            <Suspense fallback={<div>Đang xác nhận giao dịch...</div>}>
                <SuccessContent tid={tid} />
            </Suspense>
        </div>
    );
}
