"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ActionCardSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Giá không hợp lệ"),
    icon: z.string().optional(), // Emoji string
    isFeatured: z.boolean().default(false),
});

export async function getActionCards() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return [];

    return prisma.actionCard.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });
}

export async function upsertActionCard(data: z.infer<typeof ActionCardSchema>) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    const validated = ActionCardSchema.safeParse(data);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

    const { id, title, description, price, icon, isFeatured } = validated.data;

    try {
        if (id) {
            // Update checking ownership
            const existing = await prisma.actionCard.findUnique({ where: { id } });
            if (!existing || existing.creatorId !== session.user.id) return { error: "Not found or forbidden" };

            await prisma.actionCard.update({
                where: { id },
                data: { title, description, price, icon, isFeatured },
            });
        } else {
            // Create
            await prisma.actionCard.create({
                data: {
                    creatorId: session.user.id,
                    title,
                    description,
                    price,
                    icon: icon || "☕",
                    isFeatured,
                },
            });
        }

        revalidatePath(`/dashboard/actions`);
        revalidatePath(`/c/${session.user.username}`); // Refresh public profile too
        return { success: true };
    } catch (error) {
        return { error: "Database Error" };
    }
}

export async function deleteActionCard(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    try {
        const existing = await prisma.actionCard.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.actionCard.delete({ where: { id } });

        revalidatePath(`/dashboard/actions`);
        revalidatePath(`/c/${session.user.username}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}

export async function toggleFeaturedActionCard(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    try {
        const card = await prisma.actionCard.findUnique({ where: { id } });
        if (!card || card.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.actionCard.update({
            where: { id },
            data: { isFeatured: !card.isFeatured }
        });

        revalidatePath(`/dashboard/actions`);
        revalidatePath(`/c/${session.user.username}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update" };
    }
}
