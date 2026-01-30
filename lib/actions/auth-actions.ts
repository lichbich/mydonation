"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { signIn } from "@/lib/auth"; // Helper helper if needed, or allow manual login after register

const RegisterSchema = z.object({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    username: z.string().min(3, "Username tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và gạch dưới"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    role: z.enum(["FAN", "CREATOR"]),
});

export async function registerUser(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    };

    const validated = RegisterSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: "Dữ liệu không hợp lệ", details: validated.error.flatten().fieldErrors };
    }

    const { name, username, email, password, role } = validated.data;

    try {
        // Check exist
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return { error: "Email hoặc Username đã tồn tại" };
        }

        // Hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                passwordHash: hashedPassword,
                role,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                // Create profile if creator
                ...(role === 'CREATOR' ? {
                    creatorProfile: {
                        create: {
                            headline: "New Creator",
                        }
                    }
                } : {})
            }
        });

        return { success: true };

    } catch (error) {
        console.error("Register Error:", error);
        return { error: "Lỗi hệ thống đăng ký" };
    }
}
