"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDonation(data: {
    creatorId: string;
    actionCardId?: string | null;
    amount: number;
    message?: string;
    guestName?: string;
    isAnonymous?: boolean;
}) {
    const session = await auth();
    // Logic: If user logged in, use fanId. Else use guestName (or "Guest" if empty)

    const transaction = await prisma.supportTransaction.create({
        data: {
            creatorId: data.creatorId,
            fanId: session?.user?.id || null,
            actionCardId: data.actionCardId,
            amountCents: data.amount,
            message: data.message,
            guestName: data.guestName,
            isAnonymous: data.isAnonymous || false,
            status: "PENDING",
        },
    });

    return { donationId: transaction.id };
}

export async function simulatePayment(donationId: string, action: "success" | "cancel") {
    try {
        const status = action === "success" ? "SUCCESS" : "CANCEL";

        await prisma.supportTransaction.update({
            where: { id: donationId },
            data: { status },
        });

        return { success: true };
    } catch (error) {
        return { error: "Lỗi xử lý thanh toán" };
    }
}

// Mock Checkout Confirmation for Step-based Success Page
export async function confirmTransaction(donationId: string) {
    try {
        const tx = await prisma.supportTransaction.findUnique({
            where: { id: donationId },
            include: { creator: true }
        });

        if (!tx) return { error: "Transaction not found" };
        if (tx.status === 'SUCCESS') return { success: true, creatorUsername: tx.creator.username }; // Already successful

        await prisma.supportTransaction.update({
            where: { id: donationId },
            data: { status: 'SUCCESS' },
        });

        revalidatePath(`/c/${tx.creator.username}`);
        return { success: true, creatorUsername: tx.creator.username };
    } catch (error) {
        return { error: "Failed to confirm" };
    }
}

export async function getDonation(id: string) {
    return prisma.supportTransaction.findUnique({
        where: { id },
        include: {
            actionCard: true,
            creator: {
                select: { name: true, username: true, image: true }
            },
            fan: {
                select: { name: true, username: true, image: true }
            }
        }
    });
}
