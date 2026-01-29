import Link from "next/link";
import { Heart, Twitter, Github, Mail } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Tính Năng", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Khám Phá", href: "/explore" },
    ],
    company: [
        { label: "Về Chúng Tôi", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
    ],
    support: [
        { label: "Help Center", href: "#" },
        { label: "Điều Khoản", href: "#" },
        { label: "Chính Sách", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                                MyDonation
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            Nền tảng ủng hộ creator yêu thích của bạn theo cách đặc biệt.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Sản Phẩm</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Công Ty</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2026 MyDonation. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in Vietnam
                    </p>
                </div>
            </div>
        </footer>
    );
}
