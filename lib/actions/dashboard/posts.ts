"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Tiêu đề không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    visibility: z.enum(["PUBLIC", "MEMBERS"]).default("PUBLIC"),
});

export async function getDashboardPosts() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return [];

    return prisma.post.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: 'desc' },
    });
}

export async function upsertPost(data: z.infer<typeof PostSchema>) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    const validated = PostSchema.safeParse(data);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

    const { id, title, content, visibility } = validated.data;

    try {
        if (id) {
            const existing = await prisma.post.findUnique({ where: { id } });
            if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

            await prisma.post.update({
                where: { id },
                data: { title, content, visibility }
            });
        } else {
            await prisma.post.create({
                data: {
                    creatorId: session.user.id,
                    title,
                    content,
                    visibility,
                },
            });
        }
        revalidatePath(`/dashboard/posts`);
        revalidatePath(`/c/${session.user.username}/posts`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to save post" };
    }
}

export async function deletePost(id: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'CREATOR') return { error: "Unauthorized" };

    try {
        const existing = await prisma.post.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== session.user.id) return { error: "Forbidden" };

        await prisma.post.delete({ where: { id } });
        revalidatePath(`/dashboard/posts`);
        revalidatePath(`/c/${session.user.username}/posts`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete" };
    }
}
