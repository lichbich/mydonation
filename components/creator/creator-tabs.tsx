"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Image, Heart, MessageSquare } from "lucide-react";

interface CreatorTabsProps {
    username: string;
}

const tabs = [
    { label: "Tổng Quan", href: "", icon: Home },
    { label: "Bài Viết", href: "/posts", icon: FileText },
    { label: "Thư Viện", href: "/gallery", icon: Image },
    { label: "Ủng Hộ", href: "/support", icon: Heart },
    { label: "Yêu Cầu", href: "/request", icon: MessageSquare },
];

export function CreatorTabs({ username }: CreatorTabsProps) {
    const pathname = usePathname();
    const basePath = `/c/${username}`;

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-1 inline-flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
                const href = `${basePath}${tab.href}`;
                const isActive = pathname === href ||
                    (tab.href === "" && pathname === basePath);
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.href}
                        href={href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
