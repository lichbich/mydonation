"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
    Heart,
    Menu,
    User,
    LayoutDashboard,
    LogOut,
    Compass,
    Sparkles,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/explore", label: "Khám Phá" },
];

export function Header() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isCreator = (session?.user as any)?.isCreator;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                        MyDonation
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {status === "loading" ? (
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={session.user.image || ""}
                                            alt={session.user.name || ""}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white">
                                            {session.user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{session.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isCreator && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/c/${(session.user as any).username}`}
                                        className="cursor-pointer"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Trang Cá Nhân
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="cursor-pointer text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Đăng Xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/auth/login">Đăng Nhập</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/register">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Bắt Đầu
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-primary" />
                                    MyDonation
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`text-lg font-medium transition-colors hover:text-primary ${pathname === link.href
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="border-t pt-4 mt-4">
                                    {session?.user ? (
                                        <>
                                            {isCreator && (
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex items-center gap-2 text-lg font-medium mb-4"
                                                >
                                                    <LayoutDashboard className="h-5 w-5" />
                                                    Dashboard
                                                </Link>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Đăng Xuất
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    href="/auth/login"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Đăng Nhập
                                                </Link>
                                            </Button>
                                            <Button asChild>
                                                <Link
                                                    href="/auth/register"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Đăng Ký
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
