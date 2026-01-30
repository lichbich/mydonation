import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36 bg-background">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 flex justify-center">
                        <span className="relative flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/20 transition-colors cursor-default animate-fade-in-up">
                            <Sparkles className="h-4 w-4" />
                            <span>Beta Access Available</span>
                        </span>
                    </div>

                    <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Support Creators via <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">Meaningful Actions</span>
                    </h1>

                    <p className="mb-10 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Hơn cả một nền tảng donate. Tạo ra các "Action Cards" độc đáo để fan tương tác, ủng hộ và kết nối với bạn theo cách thú vị nhất.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-pink-600 border-0">
                            <Link href="/explore">
                                <Zap className="mr-2 h-5 w-5 fill-white/20" />
                                Khám Phá Ngay
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-2 hover:bg-muted/50">
                            <Link href="/auth/register">
                                Trở Thành Creator
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Stats or Trusted By (Optional) */}
                    <div className="mt-16 pt-8 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-3xl font-bold">10K+</p>
                            <p className="text-sm text-muted-foreground">Creators</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">$2M+</p>
                            <p className="text-sm text-muted-foreground">Donated</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">50K+</p>
                            <p className="text-sm text-muted-foreground">Actions</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">24/7</p>
                            <p className="text-sm text-muted-foreground">Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
