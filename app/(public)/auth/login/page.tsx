import { Suspense } from "react";
import { LoginForm } from "@/components/auth/auth-forms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng Nhập - MyDonation",
    description: "Đăng nhập vào tài khoản của bạn",
};

export default function LoginPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
                    <p className="text-sm text-muted-foreground">
                        Nhập thông tin tài khoản của bạn
                    </p>
                </div>
                <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-lg" />}>
                    <LoginForm />
                </Suspense>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Chưa có tài khoản?{" "}
                    <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}

