"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for profile update
const ProfileSchema = z.object({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    bio: z.string().max(500, "Bio tối đa 500 ký tự").optional().nullable(),
    image: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
});

const CreatorProfileSchema = z.object({
    headline: z.string().max(200, "Headline tối đa 200 ký tự").optional().nullable(),
    coverImage: z.string().url("URL ảnh bìa không hợp lệ").optional().nullable().or(z.literal("")),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Mã màu không hợp lệ").optional(),
    socialLinks: z.object({
        facebook: z.string().url().optional().or(z.literal("")),
        youtube: z.string().url().optional().or(z.literal("")),
        instagram: z.string().url().optional().or(z.literal("")),
        twitter: z.string().url().optional().or(z.literal("")),
        website: z.string().url().optional().or(z.literal("")),
    }).optional(),
});

// Get current user's full profile for settings page
export async function getMyProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            creatorProfile: true,
        },
    });

    if (!user) return null;

    // Parse socialLinks JSON
    let socialLinks = {};
    if (user.creatorProfile?.socialLinks) {
        try {
            socialLinks = JSON.parse(user.creatorProfile.socialLinks);
        } catch (e) {
            socialLinks = {};
        }
    }

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        bio: user.bio,
        role: user.role,
        creatorProfile: user.creatorProfile ? {
            ...user.creatorProfile,
            socialLinks,
        } : null,
    };
}

// Update basic user profile
export async function updateProfile(data: z.infer<typeof ProfileSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validated = ProfileSchema.safeParse(data);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ", details: validated.error.flatten() };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.data.name,
                bio: validated.data.bio || null,
                image: validated.data.image || null,
            },
        });

        revalidatePath("/dashboard/settings");
        revalidatePath(`/c/${session.user.username}`);
        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Lỗi cập nhật hồ sơ" };
    }
}

// Update creator-specific profile
export async function updateCreatorProfile(data: z.infer<typeof CreatorProfileSchema>) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== 'CREATOR') {
        return { error: "Unauthorized" };
    }

    const validated = CreatorProfileSchema.safeParse(data);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ", details: validated.error.flatten() };

    try {
        // Upsert creator profile
        await prisma.creatorProfile.upsert({
            where: { userId: session.user.id },
            update: {
                headline: validated.data.headline || null,
                coverImage: validated.data.coverImage || null,
                accentColor: validated.data.accentColor || "#3b82f6",
                socialLinks: validated.data.socialLinks ? JSON.stringify(validated.data.socialLinks) : null,
            },
            create: {
                userId: session.user.id,
                headline: validated.data.headline || null,
                coverImage: validated.data.coverImage || null,
                accentColor: validated.data.accentColor || "#3b82f6",
                socialLinks: validated.data.socialLinks ? JSON.stringify(validated.data.socialLinks) : null,
            },
        });

        revalidatePath("/dashboard/settings");
        revalidatePath(`/c/${(session.user as any).username}`);
        return { success: true };
    } catch (error) {
        console.error("Update creator profile error:", error);
        return { error: "Lỗi cập nhật hồ sơ creator" };
    }
}
