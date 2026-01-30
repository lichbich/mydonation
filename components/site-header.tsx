"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    User,
    LayoutDashboard,
    LogOut,
    Sparkles,
    Compass,
    Heart,
    Settings,
    Wallet,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Check role safely
    const isCreator = session?.user && (session.user as any).role === 'CREATOR';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                {/* Logo & Desktop Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                            <Heart className="h-5 w-5 text-white fill-white/20" />
                        </div>
                        <span className="hidden sm:inline-block bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent transition-colors group-hover:from-primary group-hover:to-pink-600">
                            MyDonation
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/explore"
                            className={cn(
                                "flex items-center gap-2 transition-colors hover:text-primary",
                                pathname === "/explore" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Compass className="h-4 w-4" />
                            Khám Phá
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
                            placeholder="Tìm kiếm creator..."
                            className="w-full bg-muted/50 border-transparent pl-10 focus:bg-background focus:border-primary/50"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Right Section / Auth */}
                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 hover:bg-muted/50">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                                            {session.user.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2" align="end">
                                <DropdownMenuLabel className="font-normal p-3 bg-muted/30">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isCreator ? (
                                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                        <Link href="/dashboard">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard Creator</span>
                                            {/* <Badge className="ml-auto text-[10px] bg-primary/20 text-primary border-none">PRO</Badge> */}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem disabled className="text-muted-foreground text-xs justify-center italic">
                                        Bạn là Fan
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/dashboard/settings">
                                        <User className="mr-2 h-4 w-4" />
                                        Trang Cá Nhân
                                    </Link>
                                </DropdownMenuItem>
                                {isCreator && (
                                    <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href="/dashboard/earnings">
                                            <Wallet className="mr-2 h-4 w-4" />
                                            Thu Nhập
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href={`/c/${(session.user as any).username || 'me'}`}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Xem Trang Public
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng Xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                                <Link href="/auth/login">Đăng nhập</Link>
                            </Button>
                            <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-pink-600 border-0">
                                <Link href="/auth/register">
                                    <Sparkles className="mr-2 h-4 w-4 fill-white/20" />
                                    Đăng ký
                                </Link>
                            </Button>
                        </>
                    )}

                    {/* Mobile Menu */}
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
                                    MyDonation
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-2 mt-8 px-2">
                                <Link
                                    href="/"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                >
                                    <Heart className="h-4 w-4" />
                                    Trang Chủ
                                </Link>
                                <Link
                                    href="/explore"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                >
                                    <Compass className="h-4 w-4" />
                                    Khám Phá
                                </Link>

                                <div className="my-4 h-px bg-border/50 mx-4" />

                                {session?.user ? (
                                    <>
                                        {isCreator && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-2"
                                            >
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard Creator
                                            </Link>
                                        )}
                                        <Link
                                            href="/dashboard/settings"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            Trang Cá Nhân
                                        </Link>
                                        {isCreator && (
                                            <Link
                                                href="/dashboard/earnings"
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                                            >
                                                <Wallet className="h-4 w-4" />
                                                Thu Nhập
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                signOut({ callbackUrl: "/" });
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Đăng Xuất
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 p-4">
                                        <Button variant="outline" asChild className="w-full justify-start">
                                            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                                                <User className="mr-2 h-4 w-4" />
                                                Đăng Nhập
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full justify-start bg-gradient-to-r from-primary to-pink-600">
                                            <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Đăng Ký Tài Khoản
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
