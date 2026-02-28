"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Search,
    Menu,
    Heart,
    Youtube,
    Music,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DonateModal } from "@/components/donate-modal";

export function SiteHeader() {
    const pathname = usePathname();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    return (
        <>
            <DonateModal open={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                <Heart className="h-5 w-5 text-white fill-white/20" />
                            </div>
                            <span className="hidden sm:inline-block bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent transition-colors group-hover:from-primary group-hover:to-pink-600">
                                MyLittleTool
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link
                                href="/youtube"
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-primary",
                                    pathname === "/youtube" ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Youtube className="h-4 w-4" />
                                Tool for Youtube
                            </Link>
                            <Link
                                href="/tiktok"
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-primary",
                                    pathname === "/tiktok" ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Music className="h-4 w-4" />
                                Tool for TikTok
                            </Link>
                        </nav>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className={cn(
                            "relative w-full transition-all duration-300",
                            isSearchFocused ? "scale-105" : ""
                        )}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tools..."
                                className="w-full bg-muted/50 border-transparent pl-10 focus:bg-background focus:border-primary/50"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* Right Section / Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsDonateOpen(true)}
                            className="hidden sm:inline-flex shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-pink-600 border-0"
                        >
                            <Heart className="mr-1.5 h-4 w-4 fill-white/30" />
                            Donate
                        </Button>
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-1 md:hidden" suppressHydrationWarning>
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] pr-0">
                                <SheetHeader className="px-4 text-left">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                            <Heart className="h-4 w-4 text-white" />
                                        </div>
                                        MyLittleTool
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2 mt-8 px-2">
                                    <Link
                                        href="/"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                    >
                                        <Heart className="h-4 w-4" />
                                        Home
                                    </Link>
                                    <Link
                                        href="/youtube"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                    >
                                        <Youtube className="h-4 w-4" />
                                        Tool for Youtube
                                    </Link>
                                    <Link
                                        href="/tiktok"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                    >
                                        <Music className="h-4 w-4" />
                                        Tool for TikTok
                                    </Link>
                                    <div className="my-4 h-px bg-border/50 mx-4" />
                                    <div className="px-4">
                                        <Button
                                            onClick={() => { setMobileOpen(false); setIsDonateOpen(true); }}
                                            className="w-full justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-pink-600 border-0"
                                        >
                                            <Heart className="mr-1.5 h-4 w-4 fill-white/30" />
                                            Donate
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}
