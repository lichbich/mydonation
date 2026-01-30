"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, subDays, format } from "date-fns";

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    // Get total donations received (as creator)
    const transactionsReceived = await prisma.supportTransaction.findMany({
        where: {
            creatorId: userId,
            status: "SUCCESS"
        }
    });

    const totalDonations = transactionsReceived.length;
    const totalEarnings = transactionsReceived.reduce((acc, curr) => acc + curr.amountCents, 0);

    // Get unique supporters
    const uniqueSupporters = new Set(
        transactionsReceived
            .filter(t => t.fanId)
            .map(t => t.fanId)
    );
    const supporterCount = uniqueSupporters.size;

    // Get action cards count
    const actionCardsCount = await prisma.actionCard.count({
        where: { creatorId: userId }
    });

    // Get recent transactions
    const recentTransactions = await prisma.supportTransaction.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            fan: { select: { name: true, image: true } },
            actionCard: { select: { title: true, icon: true } }
        }
    });

    return {
        totalDonations,
        totalEarnings,
        supporterCount,
        actionCardsCount,
        recentTransactions
    };
}

export async function getEarningsStats() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return null;

    const creatorId = session.user.id;
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);

    // Fetch transactions
    const successfulTransactions = await prisma.supportTransaction.findMany({
        where: {
            creatorId,
            status: "SUCCESS"
        },
        orderBy: { createdAt: "desc" }
    });

    // Calc totals
    const totalAllTime = successfulTransactions.reduce((acc, curr) => acc + curr.amountCents, 0);
    const total30d = successfulTransactions
        .filter(t => t.createdAt >= thirtyDaysAgo)
        .reduce((acc, curr) => acc + curr.amountCents, 0);

    // Chart Data (Last 30 days)
    // Group by Date (YYYY-MM-DD)
    const chartDataMap = new Map<string, number>();

    // Init last 30 days with 0
    for (let i = 29; i >= 0; i--) {
        const date = subDays(now, i);
        const key = format(date, 'yyyy-MM-dd');
        chartDataMap.set(key, 0);
    }

    successfulTransactions.forEach(t => {
        if (t.createdAt >= thirtyDaysAgo) {
            const key = format(t.createdAt, 'yyyy-MM-dd');
            if (chartDataMap.has(key)) {
                chartDataMap.set(key, chartDataMap.get(key)! + t.amountCents);
            }
        }
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, amount]) => ({
        date,
        amount
    }));

    return {
        totalAllTime,
        total30d,
        recentTransactions: successfulTransactions.slice(0, 20), // Top 20 recent
        chartData
    };
}

