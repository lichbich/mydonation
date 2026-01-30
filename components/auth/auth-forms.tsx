"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Make sure to add radio-group
import { registerUser } from "@/lib/actions/auth-actions"; // Ensure this action exists

// --- Login Form ---

const loginSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập username"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Đăng nhập thất bại. Kiểm tra lại thông tin.");
                setIsLoading(false);
                return;
            }

            // Success -> Check session for role redirect
            // We fetch session manually to check role
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            toast.success("Đăng nhập thành công!");

            if (session?.user?.role === "CREATOR") {
                router.push("/dashboard");
            } else {
                router.push(callbackUrl);
            }
            router.refresh();

        } catch (error) {
            toast.error("Lỗi hệ thống");
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng Nhập
                </Button>
            </form>
        </Form>
    );
}

// --- Register Form ---

const registerSchema = z.object({
    name: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự"),
    username: z.string().min(3, "Username tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Chữ cái, số và gạch dưới"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    role: z.string().min(1, "Vui lòng chọn vai trò"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            role: "FAN",
        },
    });

    async function onSubmit(values: RegisterFormData) {
        setIsLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => formData.append(key, val));

        const result = await registerUser(formData);

        if (result.error) {
            toast.error(result.error);
            setIsLoading(false);
            return;
        }

        if (result.success) {
            toast.success("Đăng ký thành công! Đang chuyển hướng đăng nhập...");
            // Auto login logic could be here, but let's redirect to login for simplicity
            router.push("/auth/login");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên hiển thị</FormLabel>
                            <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username (để tạo URL profile)</FormLabel>
                            <FormControl>
                                <Input placeholder="nguyenvana" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Tôi muốn trở thành...</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="FAN" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Fan (Người ủng hộ)
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="CREATOR" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Creator (Nhà sáng tạo nội dung)
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng Ký Tài Khoản
                </Button>
            </form>
        </Form>
    );
}
