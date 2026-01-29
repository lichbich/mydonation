"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { donationSchema, DonationInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createDonation(data: DonationInput) {
    const session = await auth();

    const validated = donationSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        const actionCard = await prisma.actionCard.findUnique({
            where: { id: data.actionCardId, isActive: true },
            include: { creator: true },
        });

        if (!actionCard) {
            return { error: "Action Card không tồn tại hoặc đã bị vô hiệu hóa" };
        }

        const totalAmount = actionCard.price * validated.data.quantity;

        const donation = await prisma.donation.create({
            data: {
                amount: totalAmount,
                quantity: validated.data.quantity,
                message: validated.data.message,
                isAnonymous: validated.data.isAnonymous,
                status: "pending",
                actionCardId: actionCard.id,
                creatorId: actionCard.creatorId,
                supporterId: session?.user?.id || null,
            },
        });

        return {
            success: true,
            data: {
                donationId: donation.id,
                amount: totalAmount,
                creatorName: actionCard.creator.name,
                creatorUsername: actionCard.creator.username,
            }
        };
    } catch (error) {
        console.error(error);
        return { error: "Không thể tạo donation" };
    }
}

export async function simulatePayment(donationId: string, status: "success" | "cancel") {
    try {
        const donation = await prisma.donation.findUnique({
            where: { id: donationId },
            include: { creator: true },
        });

        if (!donation) {
            return { error: "Không tìm thấy donation" };
        }

        if (status === "success") {
            await prisma.donation.update({
                where: { id: donationId },
                data: {
                    status: "completed",
                    paymentIntentId: `mock_pi_${Date.now()}`,
                },
            });

            revalidatePath(`/${donation.creator.username}`);
            revalidatePath("/dashboard");

            return { success: true, status: "completed" };
        } else {
            await prisma.donation.update({
                where: { id: donationId },
                data: { status: "cancelled" },
            });

            return { success: true, status: "cancelled" };
        }
    } catch (error) {
        return { error: "Không thể xử lý thanh toán" };
    }
}

export async function getCreatorDonations(creatorId: string, limit = 10) {
    return prisma.donation.findMany({
        where: {
            creatorId,
            status: "completed",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
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
    });
}

export async function getMyDonations() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return prisma.donation.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: "desc" },
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
    });
}

export async function getCreatorStats(creatorId: string) {
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

