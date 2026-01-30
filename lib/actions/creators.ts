"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type definitions
export interface CreatorProfileData {
    id: string;
    name: string;
    username: string;
    image: string | null;
    headline: string | null;
    bio: string | null;
    creatorProfile: any;
    actionCards: any[];
    stats: {
        totalDonations: number;
        totalAmount: number;
        supporterCount: number;
    };
    recentSupport: any[];
}

export type ExploreParams = {
    q?: string;
    sort?: string; // 'newest' | 'popular' | 'trending'
    hasMembership?: boolean;
    hasFeatured?: boolean;
    page?: number;
};

export async function exploreCreators(params: ExploreParams) {
    const { q, sort = 'newest', hasMembership, hasFeatured, page = 1 } = params;

    const limit = 12;
    const skip = (page - 1) * limit;

    // Build Where input
    const where: any = {
        role: 'CREATOR', // Chỉ lấy Creator
    };

    if (q) {
        where.OR = [
            { name: { contains: q } }, // SQLite case-insensitive by default roughly for ASCII, specific for prisma depends. 
            // Note: In some DBs mode: 'insensitive' needed. SQLite is usually insensitive for LIKE but check Prisma docs.
            // Prisma + SQLite: contains is case insensitive.
            { username: { contains: q } },
            // Can extend to bio searches
        ];
    }

    if (hasMembership) {
        where.membershipTiers = { some: {} }; // At least one tier
    }

    if (hasFeatured) {
        where.actionCards = { some: { isFeatured: true } };
    }

    // Build OrderBy
    let orderBy: any = { createdAt: 'desc' }; // Default newest

    if (sort === 'popular') {
        // Most total transactions
        orderBy = {
            receivedSupport: {
                _count: 'desc'
            }
        };
    } else if (sort === 'trending') {
        // For simplicity in this stack, trending = recent activity (updatedAt or similar) 
        // OR most donations roughly. Let's use receivedSupport count too but maybe a different logic if we had 'lastTransactionAt'
        // Let's fallback to popularity for now, later implement true trending
        orderBy = {
            receivedSupport: {
                _count: 'desc'
            }
        };
    }

    // Execute Query
    const [creators, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy,
            take: limit,
            skip,
            include: {
                creatorProfile: true,
                actionCards: {
                    where: { isFeatured: true }, // Only fetch featured for preview
                    take: 2
                },
                membershipTiers: {
                    take: 1
                },
                _count: {
                    select: { receivedSupport: true } // Count donations for UI stats
                }
            }
        }),
        prisma.user.count({ where })
    ]);

    return {
        creators,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            current: page,
        }
    };
}

export async function getCreatorProfile(username: string) {
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            creatorProfile: true,
            actionCards: {
                orderBy: { price: 'asc' } // Sắp xếp giá tăng dần
            },
            membershipTiers: {
                where: { isActive: true },
                orderBy: { priceMonthlyCents: 'asc' }
            },
            posts: {
                where: { visibility: 'PUBLIC' },
                orderBy: { createdAt: 'desc' },
                take: 3
            },
            galleryItems: {
                // Lấy cả public và member (mờ đi nếu member) cho creator page
                orderBy: { createdAt: 'desc' },
                take: 6
            }
        },
    });

    if (!user || user.role !== 'CREATOR') {
        return null;
    }

    // Fetch stats and recent support
    const [recentSupport, stats] = await Promise.all([
        prisma.supportTransaction.findMany({
            where: { creatorId: user.id, status: "SUCCESS" },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                actionCard: true,
                fan: {
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
        ...user,
        headline: user.creatorProfile?.headline,
        coverImage: user.creatorProfile?.coverImage,
        socialLinks: user.creatorProfile?.socialLinks ? JSON.parse(user.creatorProfile.socialLinks) : null,
        recentSupport,
        // Helper mapping
        recentDonations: recentSupport.map(s => ({
            ...s,
            supporter: s.fan,
            amount: s.amountCents
        })),
        stats,
    };
}


async function getCreatorStatsInternal(creatorId: string) {
    const [donations, totalAmount, supporters] = await Promise.all([
        prisma.supportTransaction.count({
            where: { creatorId, status: "SUCCESS" },
        }),
        prisma.supportTransaction.aggregate({
            where: { creatorId, status: "SUCCESS" },
            _sum: { amountCents: true },
        }),
        prisma.supportTransaction.groupBy({
            by: ["fanId"],
            where: { creatorId, status: "SUCCESS", fanId: { not: null } },
        }),
    ]);

    return {
        totalDonations: donations,
        totalAmount: totalAmount._sum.amountCents || 0,
        supporterCount: supporters.length,
    };
}

export async function getFeaturedCreators(limit = 6) {
    return prisma.user.findMany({
        where: { role: 'CREATOR' },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            creatorProfile: true,
            actionCards: {
                take: 3,
            },
            _count: {
                select: { receivedSupport: true }
            }
        },
    });
}

export async function getCreatorGallery(username: string) {
    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            galleryItems: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user || user.role !== 'CREATOR') return [];
    return user.galleryItems;
}
