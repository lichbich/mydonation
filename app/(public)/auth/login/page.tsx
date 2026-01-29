"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Email hoặc mật khẩu không đúng");
            } else {
                toast.success("Đăng nhập thành công!");
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Đăng Nhập</CardTitle>
                <CardDescription>
                    Chào mừng bạn trở lại MyDonation
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Đăng Nhập
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Demo Accounts
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground space-y-1">
                        <p>📧 nguyenvana@demo.com / 123456</p>
                        <p>📧 tranthib@demo.com / 123456</p>
                        <p>📧 supporter@demo.com / 123456</p>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Chưa có tài khoản?{" "}
                    <Link href="/auth/register" className="text-primary hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
