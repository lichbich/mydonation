"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const GalleryItemSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().url("URL không hợp lệ"),
    type: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
    visibility: z.enum(["PUBLIC", "MEMBERS"]).default("PUBLIC"),
});

export async function getDashboardGallery() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return [];

    return prisma.galleryItem.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });
}

export async function upsertGalleryItem(data: z.infer<typeof GalleryItemSchema>) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    const validated = GalleryItemSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid data" };

    const { id, title, url, type, visibility } = validated.data;

    // Auto detect type if needed, but for now rely on user input

    try {
        if (id) {
            const existing = await prisma.galleryItem.findUnique({ where: { id } });
            if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

            await prisma.galleryItem.update({
                where: { id },
                data: { title, url, type, visibility }
            });
        } else {
            await prisma.galleryItem.create({
                data: {
                    creatorId: session.user.id,
                    title,
                    url,
                    type,
                    visibility
                },
            });
        }
        revalidatePath(`/dashboard/gallery`);
        revalidatePath(`/c/${session.user.username}/gallery`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to save item" };
    }
}

export async function deleteGalleryItem(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    try {
        const existing = await prisma.galleryItem.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.galleryItem.delete({ where: { id } });
        revalidatePath(`/dashboard/gallery`);
        revalidatePath(`/c/${session.user.username}/gallery`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}
