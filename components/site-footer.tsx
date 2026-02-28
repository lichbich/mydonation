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
                            A collection of completely free and useful little tools. Don't forget to buy me a coffee if you find it helpful!
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Tools</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/youtube" className="text-foreground/80 hover:text-primary transition-colors">Youtube Tools</Link></li>
                            <li><Link href="/tiktok" className="text-foreground/80 hover:text-primary transition-colors">TikTok Tools</Link></li>
                            <li><Link href="/#donate" className="text-foreground/80 hover:text-primary transition-colors">Donate to me</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li><span className="text-foreground/80">admin@example.com</span></li>
                            <li><span className="text-foreground/80">Paypal: 0123.456.789</span></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Personal Tools. Built with ❤️ in US.
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
