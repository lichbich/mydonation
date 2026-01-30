"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TierSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title Required"),
    description: z.string().optional(),
    priceMonthly: z.coerce.number().min(0),
    perks: z.array(z.string()).default([]), // UI will send array, we stringify
    isActive: z.boolean().default(true),
});

export async function getDashboardTiers() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return [];

    return prisma.membershipTier.findMany({
        where: { creatorId: session.user.id },
        orderBy: { priceMonthlyCents: 'asc' },
    });
}

export async function upsertTier(data: z.infer<typeof TierSchema>) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    const validated = TierSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid Data" };

    const { id, title, description, priceMonthly, perks, isActive } = validated.data;
    const perksJson = JSON.stringify(perks);
    const priceCents = priceMonthly; // Assuming input is already appropriate, or handle cents logic in UI

    try {
        if (id) {
            const existing = await prisma.membershipTier.findUnique({ where: { id } });
            if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

            await prisma.membershipTier.update({
                where: { id },
                data: { title, description, priceMonthlyCents: priceCents, perks: perksJson, isActive },
            });
        } else {
            await prisma.membershipTier.create({
                data: {
                    creatorId: session.user.id,
                    title,
                    description,
                    priceMonthlyCents: priceCents,
                    perks: perksJson,
                    isActive
                }
            });
        }
        revalidatePath(`/dashboard/tiers`);
        revalidatePath(`/c/${session.user.username}/membership`); // future path
        revalidatePath(`/c/${session.user.username}`); // Teaser
        return { success: true };
    } catch (error) {
        return { error: "Failed to save tier" };
    }
}

export async function deleteTier(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    try {
        const existing = await prisma.membershipTier.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.membershipTier.delete({ where: { id } });
        revalidatePath(`/dashboard/tiers`);
        revalidatePath(`/c/${session.user.username}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}
