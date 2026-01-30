import Link from "next/link";
import { Heart, Github, Twitter, Instagram } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
            <div className="container px-4 py-8 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Heart className="h-4 w-4 text-primary" />
                            </div>
                            <span>MyDonation</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                            Nền tảng kết nối Creators và Fans thông qua những hành động ủng hộ ý nghĩa.
                            Giúp Creators sống với đam mê.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Sản Phẩm</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/explore" className="text-foreground/80 hover:text-primary transition-colors">Khám Phá</Link></li>
                            <li><Link href="/features" className="text-foreground/80 hover:text-primary transition-colors">Tính Năng</Link></li>
                            <li><Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors">Bảng Giá Creator</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Hỗ Trợ</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="text-foreground/80 hover:text-primary transition-colors">Trung Tâm Hỗ Trợ</Link></li>
                            <li><Link href="/terms" className="text-foreground/80 hover:text-primary transition-colors">Điều Khoản</Link></li>
                            <li><Link href="/privacy" className="text-foreground/80 hover:text-primary transition-colors">Bảo Mật</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} MyDonation. Built with ❤️ in Vietnam.
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
