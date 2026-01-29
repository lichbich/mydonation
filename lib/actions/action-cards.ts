"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionCardSchema, ActionCardInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createActionCard(data: ActionCardInput) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập" };
    }

    const validated = actionCardSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        const count = await prisma.actionCard.count({
            where: { creatorId: session.user.id },
        });

        const actionCard = await prisma.actionCard.create({
            data: {
                ...validated.data,
                creatorId: session.user.id,
                sortOrder: count,
            },
        });

        // Enable creator mode if not already
        await prisma.user.update({
            where: { id: session.user.id },
            data: { isCreator: true },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/${(session.user as any).username}`);

        return { success: true, data: actionCard };
    } catch (error) {
        return { error: "Không thể tạo Action Card" };
    }
}

export async function updateActionCard(id: string, data: ActionCardInput) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập" };
    }

    const validated = actionCardSchema.safeParse(data);
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    try {
        const actionCard = await prisma.actionCard.findFirst({
            where: { id, creatorId: session.user.id },
        });

        if (!actionCard) {
            return { error: "Không tìm thấy Action Card" };
        }

        const updated = await prisma.actionCard.update({
            where: { id },
            data: validated.data,
        });

        revalidatePath("/dashboard");
        revalidatePath(`/${(session.user as any).username}`);

        return { success: true, data: updated };
    } catch (error) {
        return { error: "Không thể cập nhật Action Card" };
    }
}

export async function deleteActionCard(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập" };
    }

    try {
        const actionCard = await prisma.actionCard.findFirst({
            where: { id, creatorId: session.user.id },
        });

        if (!actionCard) {
            return { error: "Không tìm thấy Action Card" };
        }

        await prisma.actionCard.delete({ where: { id } });

        revalidatePath("/dashboard");
        revalidatePath(`/${(session.user as any).username}`);

        return { success: true };
    } catch (error) {
        return { error: "Không thể xóa Action Card" };
    }
}

export async function toggleActionCard(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Bạn cần đăng nhập" };
    }

    try {
        const actionCard = await prisma.actionCard.findFirst({
            where: { id, creatorId: session.user.id },
        });

        if (!actionCard) {
            return { error: "Không tìm thấy Action Card" };
        }

        await prisma.actionCard.update({
            where: { id },
            data: { isActive: !actionCard.isActive },
        });

        revalidatePath("/dashboard");
        revalidatePath(`/${(session.user as any).username}`);

        return { success: true };
    } catch (error) {
        return { error: "Không thể cập nhật Action Card" };
    }
}

export async function getMyActionCards() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    return prisma.actionCard.findMany({
        where: { creatorId: session.user.id },
        orderBy: { sortOrder: "asc" },
        include: {
            _count: {
                select: { donations: true },
            },
        },
    });
}

