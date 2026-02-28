import Link from "next/link";
import { Heart, Github, Twitter, Instagram, Coffee } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
            <div className="container px-4 py-8 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Coffee className="h-4 w-4 text-primary" />
                            </div>
                            <span>Personal Tools</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            Trang web tổng hợp các công cụ nhỏ hữu ích hoàn toàn miễn phí. Đừng quên ủng hộ tôi một ly cà phê nếu bạn thấy dùng tốt nhé!
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Công Cụ</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/youtube" className="text-foreground/80 hover:text-primary transition-colors">Youtube Tools</Link></li>
                            <li><Link href="/tiktok" className="text-foreground/80 hover:text-primary transition-colors">TikTok Tools</Link></li>
                            <li><Link href="/#donate" className="text-foreground/80 hover:text-primary transition-colors">Ủng hộ tôi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Liên Hệ</h3>
                        <ul className="space-y-3 text-sm">
                            <li><span className="text-foreground/80">admin@ví-dụ.com</span></li>
                            <li><span className="text-foreground/80">MoMo: 0123.456.789</span></li>
                            <li><span className="text-foreground/80">Vietcombank: 9999999</span></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Personal Tools. Built with ❤️ in Vietnam.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
