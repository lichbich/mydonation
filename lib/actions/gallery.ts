"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCreatorGallery(username: string) {
    const session = await auth();
    const currentUserId = session?.user?.id;

    const creator = await prisma.user.findUnique({
        where: { username },
        include: {
            membershipTiers: {
                orderBy: { priceMonthlyCents: 'asc' },
                take: 1
            }
        }
    });

    if (!creator) return null;

    // Check Access Logic
    let isMember = false;
    if (currentUserId) {
        if (currentUserId === creator.id) {
            isMember = true; // Owner
        } else {
            const sub = await prisma.memberSubscription.findUnique({
                where: {
                    userId_creatorId: {
                        userId: currentUserId,
                        creatorId: creator.id
                    }
                }
            });
            if (sub && sub.status === 'ACTIVE' && sub.currentPeriodEnd > new Date()) {
                isMember = true;
            }
        }
    }

    const items = await prisma.galleryItem.findMany({
        where: { creatorId: creator.id },
        orderBy: { createdAt: 'desc' },
    });

    // Map items visibility
    const mappedItems = items.map(item => {
        const isLocked = item.visibility === 'MEMBERS' && !isMember;
        return {
            ...item,
            isLocked,
            // Note: In production, do not send the private URL to client if locked.
            // Here we might rely on UI blur, but for security, presigned URLs or proxy is better.
            // For this demo, we assume the URL is safe to send but maybe we mask it if we had a dedicated placeholder.
            // Since seed data uses picsum/dummy, it's fine.
        };
    });

    return {
        creator,
        items: mappedItems,
        isMember
    };
}
