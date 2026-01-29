"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Image,
    CreditCard,
    Crown,
    MessageSquare,
    DollarSign,
    Settings,
    Heart,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarLinks = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Bài Viết",
        href: "/dashboard/posts",
        icon: FileText,
    },
    {
        label: "Thư Viện",
        href: "/dashboard/gallery",
        icon: Image,
    },
    {
        label: "Action Cards",
        href: "/dashboard/actions",
        icon: CreditCard,
    },
    {
        label: "Membership",
        href: "/dashboard/tiers",
        icon: Crown,
    },
    {
        label: "Yêu Cầu",
        href: "/dashboard/requests",
        icon: MessageSquare,
    },
    {
        label: "Thu Nhập",
        href: "/dashboard/earnings",
        icon: DollarSign,
    },
    {
        label: "Cài Đặt",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const username = (session?.user as any)?.username;

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-background/95 backdrop-blur-xl hidden lg:block">
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border/40">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                            MyDonation
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{session?.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                @{username}
                            </p>
                        </div>
                    </div>
                    {username && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            asChild
                        >
                            <Link href={`/c/${username}`} target="_blank">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                Xem Trang
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="px-3 space-y-1">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href ||
                                (link.href !== "/dashboard" && pathname.startsWith(link.href));
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t border-border/40">
                    <p className="text-xs text-muted-foreground text-center">
                        © 2026 MyDonation
                    </p>
                </div>
            </div>
        </aside>
    );
}

export function DashboardMobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/40 lg:hidden">
            <nav className="flex justify-around py-2">
                {sidebarLinks.slice(0, 5).map((link) => {
                    const isActive = pathname === link.href ||
                        (link.href !== "/dashboard" && pathname.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="truncate max-w-[60px]">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
