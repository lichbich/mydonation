"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getEarningsData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    // Get all support transactions for this creator
    const transactions = await prisma.supportTransaction.findMany({
        where: {
            creatorId: userId,
            status: "SUCCESS",
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            fan: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    username: true,
                },
            },
            actionCard: {
                select: {
                    id: true,
                    title: true,
                    icon: true,
                },
            },
        },
    });

    // Get aggregated stats
    const [totalStats, monthlyStats, topSupporters] = await Promise.all([
        // All time stats
        prisma.supportTransaction.aggregate({
            where: { creatorId: userId, status: "SUCCESS" },
            _sum: { amountCents: true },
            _count: { id: true },
        }),
        // This month stats
        prisma.supportTransaction.aggregate({
            where: {
                creatorId: userId,
                status: "SUCCESS",
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: { amountCents: true },
            _count: { id: true },
        }),
        // Top supporters
        prisma.supportTransaction.groupBy({
            by: ["fanId"],
            where: {
                creatorId: userId,
                status: "SUCCESS",
                fanId: { not: null },
            },
            _sum: { amountCents: true },
            _count: { id: true },
            orderBy: { _sum: { amountCents: "desc" } },
            take: 10,
        }),
    ]);

    // Fetch supporter details
    const supporterIds = topSupporters.map((s: { fanId: string | null }) => s.fanId).filter(Boolean) as string[];
    const supporterDetails = await prisma.user.findMany({
        where: { id: { in: supporterIds } },
        select: { id: true, name: true, image: true, username: true },
    });

    const topSupportersWithDetails = topSupporters.map((s: typeof topSupporters[0]) => {
        const user = supporterDetails.find((u: { id: string }) => u.id === s.fanId);
        return {
            ...s,
            fan: user,
        };
    });

    // Count unique supporters
    const uniqueSupporters = await prisma.supportTransaction.groupBy({
        by: ["fanId"],
        where: { creatorId: userId, status: "SUCCESS" },
    });

    return {
        transactions,
        stats: {
            totalAmount: totalStats._sum.amountCents || 0,
            totalDonations: totalStats._count.id || 0,
            monthlyAmount: monthlyStats._sum.amountCents || 0,
            monthlyDonations: monthlyStats._count.id || 0,
            uniqueSupporters: uniqueSupporters.length,
        },
        topSupporters: topSupportersWithDetails,
    };
}
