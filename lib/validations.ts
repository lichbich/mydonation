import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    username: z
        .string()
        .min(3, "Username phải có ít nhất 3 ký tự")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username chỉ được chứa chữ, số, _ và -"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    role: z.enum(["FAN", "CREATOR"]).optional().default("FAN"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export const actionCardSchema = z.object({
    title: z.string().min(2, "Tiêu đề phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
    price: z.number().min(1000, "Giá tối thiểu 1,000đ"),
    icon: z.string().optional(),
    isFeatured: z.boolean(),
});

export const profileSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    bio: z.string().optional(),
    creatorTitle: z.string().optional(),
    creatorBio: z.string().optional(),
    twitter: z.string().url().optional().or(z.literal("")),
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
});

export const donationSchema = z.object({
    actionCardId: z.string().min(1),
    quantity: z.number().min(1).max(100),
    message: z.string().max(500).optional(),
    isAnonymous: z.boolean().default(false),
    supporterName: z.string().optional(),
    supporterEmail: z.string().email().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Explicit type for ActionCardInput to avoid type inference issues
export type ActionCardInput = {
    title: string;
    description?: string;
    price: number;
    icon?: string;
    isFeatured: boolean;
};

export type ProfileInput = z.infer<typeof profileSchema>;
export type DonationInput = z.infer<typeof donationSchema>;

