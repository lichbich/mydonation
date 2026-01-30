import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-pink-600 px-6 py-20 text-center shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                            Sẵn sàng để bắt đầu hành trình của bạn?
                        </h2>
                        <p className="text-lg text-white/90">
                            Tham gia cộng đồng Creators sáng tạo và bắt đầu nhận sự ủng hộ từ fans ngay hôm nay. Hoàn toàn miễn phí để bắt đầu.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-base bg-white text-primary hover:bg-white/90 border-0 shadow-xl">
                                <Link href="/auth/register">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Tạo Trang Của Tôi
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">
                                <Link href="/explore">
                                    Khám Phá Trước <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-white/60">
                            Không cần thẻ tín dụng. Setup trong vòng 2 phút.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
