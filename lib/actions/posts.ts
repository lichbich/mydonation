"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCreatorPosts(username: string) {
    const creator = await prisma.user.findUnique({ where: { username } });
    if (!creator) return null;

    const posts = await prisma.post.findMany({
        where: { creatorId: creator.id },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            content: true,
            visibility: true,
            createdAt: true,
        }
    });

    return {
        creatorId: creator.id,
        posts: posts.map(p => ({
            ...p,
            excerpt: p.content.length > 200 ? p.content.substring(0, 200) + "..." : p.content,
            content: undefined // Remove content list
        }))
    };
}

export async function getPostDetail(username: string, postId: string) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    role: true,
                    membershipTiers: {
                        orderBy: { priceMonthlyCents: 'asc' },
                        take: 1
                    }
                }
            }
        }
    });

    if (!post || post.creator.username !== username) return null;

    let hasAccess = false;

    if (post.visibility === 'PUBLIC') {
        hasAccess = true;
    } else {
        // MEMBERS ONLY
        if (currentUserId) {
            if (currentUserId === post.creator.id) {
                hasAccess = true; // Creator owner
            } else {
                // Check subscription
                const sub = await prisma.memberSubscription.findUnique({
                    where: {
                        userId_creatorId: {
                            userId: currentUserId,
                            creatorId: post.creator.id
                        }
                    }
                });

                // Allow if active
                if (sub && sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()) {
                    hasAccess = true;
                }
            }
        }
    }

    return {
        ...post,
        hasAccess,
        content: hasAccess ? post.content : null,
        // Pass first tier info for CTA if locked
        lowestTier: !hasAccess ? post.creator.membershipTiers[0] : null
    };
}
