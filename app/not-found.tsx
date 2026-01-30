import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center space-y-4">
            <div className="relative">
                <h1 className="text-9xl font-black text-muted/20 select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-3xl font-bold text-foreground">Trang không tìm thấy</h2>
                </div>
            </div>

            <p className="text-muted-foreground max-w-[500px]">
                Đường dẫn bạn truy cập có thể không chính xác hoặc Creator này không còn hoạt động.
            </p>

            <div className="flex gap-4 pt-4">
                <Button asChild size="lg">
                    <Link href="/">Về Trang Chủ</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/explore">Khám Phá Creator</Link>
                </Button>
            </div>
        </div>
    )
}
