import { RegisterForm } from "@/components/auth/auth-forms";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng Ký - MyDonation",
    description: "Tạo tài khoản mới",
};

export default function RegisterPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Tạo tài khoản</h1>
                    <p className="text-sm text-muted-foreground">
                        Tham gia cộng đồng Creator lớn nhất Việt Nam
                    </p>
                </div>
                <RegisterForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
