"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema, registerSchema, RegisterInput, LoginInput } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function login(data: LoginInput) {
    const validated = loginSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        return { error: "Email hoặc mật khẩu không đúng" };
    }
}

export async function register(data: RegisterInput) {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email: data.email }, { username: data.username }],
        },
    });

    if (existingUser) {
        if (existingUser.email === data.email) {
            return { error: "Email đã được sử dụng" };
        }
        return { error: "Username đã được sử dụng" };
    }

    try {
        await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password, // In production, hash this!
            },
        });

        return { success: true };
    } catch (error) {
        return { error: "Đã có lỗi xảy ra" };
    }
}

export async function logout() {
    await signOut({ redirect: false });
    redirect("/");
}

