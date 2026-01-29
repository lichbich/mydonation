"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileSchema, ProfileInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { SocialLinks, CreatorProfile } from "@/lib/types";

export async function updateProfile(data: ProfileInput) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập" };
    }

    const validated = profileSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        const socialLinks: SocialLinks = {
            twitter: data.twitter || undefined,
            facebook: data.facebook || undefined,
            instagram: data.instagram || undefined,
            youtube: data.youtube || undefined,
            website: data.website || undefined,
        };

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                bio: data.bio,
                creatorTitle: data.creatorTitle,
                creatorBio: data.creatorBio,
                socialLinks: JSON.stringify(socialLinks),
            },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/${(session.user as any).username}`);

        return { success: true };
    } catch (error) {
        return { error: "Không thể cập nhật profile" };
    }
}

export async function getCreatorProfile(username: string) {
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            actionCards: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    if (!user || !user.isCreator) {
        return null;
    }

    const [recentDonations, stats] = await Promise.all([
        prisma.donation.findMany({
            where: { creatorId: user.id, status: "completed" },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                actionCard: true,
                supporter: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        username: true,
                    },
                },
            },
        }),
        getCreatorStatsInternal(user.id),
    ]);

    return {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        bio: user.bio,
        creatorTitle: user.creatorTitle,
        creatorBio: user.creatorBio,
        creatorCoverUrl: user.creatorCoverUrl,
        socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
        actionCards: user.actionCards,
        recentDonations,
        stats,
    };
}

async function getCreatorStatsInternal(creatorId: string) {
    const [donations, totalAmount, supporters] = await Promise.all([
        prisma.donation.count({
            where: { creatorId, status: "completed" },
        }),
        prisma.donation.aggregate({
            where: { creatorId, status: "completed" },
            _sum: { amount: true },
        }),
        prisma.donation.groupBy({
            by: ["supporterId"],
            where: { creatorId, status: "completed", supporterId: { not: null } },
        }),
    ]);

    return {
        totalDonations: donations,
        totalAmount: totalAmount._sum.amount || 0,
        supporterCount: supporters.length,
    };
}

export async function getMyProfile() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            actionCards: {
                orderBy: { sortOrder: "asc" },
            },
        },
    });
}

export async function getFeaturedCreators(limit = 6) {
    return prisma.user.findMany({
        where: { isCreator: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            actionCards: {
                where: { isActive: true },
                take: 3,
            },
            _count: {
                select: { received: true },
            },
        },
    });
}

