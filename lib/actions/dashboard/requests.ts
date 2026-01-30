"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getDashboardRequests() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return [];

    return prisma.request.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            fan: { select: { name: true, username: true, email: true, image: true } }
        }
    });
}

const UpdateStatusSchema = z.object({
    id: z.string(),
    status: z.enum(["NEW", "IN_PROGRESS", "DONE", "REJECTED"]),
});

export async function updateRequestStatus(id: string, status: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    const validated = UpdateStatusSchema.safeParse({ id, status });
    if (!validated.success) return { error: "Invalid data" };

    try {
        const existing = await prisma.request.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.request.update({
            where: { id },
            data: { status: validated.data.status }
        });

        revalidatePath(`/dashboard/requests`);
        return { success: true };
    } catch (error) {
        return { error: "Failed update" };
    }
}
