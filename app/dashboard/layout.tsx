"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar, DashboardMobileNav } from "@/components/layout/dashboard-sidebar";

// Simple Breadcrumb implementation if Shadcn one is missing
function SimpleBreadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav aria-label="Breadcrumb" className="hidden md:flex">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                    <Link href="/dashboard" className="transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                </li>
                {segments.slice(1).map((segment, index) => {
                    const href = `/dashboard/${segments.slice(1, index + 1).join('/')}`;
                    const isLast = index === segments.length - 2;
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                        <li key={segment} className="flex items-center gap-2">
                            <span className="text-muted-foreground/40">/</span>
                            {isLast ? (
                                <span className="font-medium text-foreground">{title}</span>
                            ) : (
                                <Link href={href} className="transition-colors hover:text-foreground">
                                    {title}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar Desktop */}
            <aside className="hidden md:block w-64 border-r border-border/40 bg-muted/10">
                <DashboardSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Dashboard Header */}
                <header className="flex h-14 items-center gap-4 border-b border-border/40 bg-background/50 px-6 backdrop-blur-sm lg:h-[60px]">
                    <DashboardMobileNav />

                    <div className="flex-1">
                        <SimpleBreadcrumbs />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Add theme toggle or other actions here */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
