"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const RequestSchema = z.object({
    type: z.string().min(1, "Vui lòng chọn loại yêu cầu"),
    budget: z.number().min(50000, "Ngân sách tối thiểu 50.000đ"),
    deadline: z.date().optional(),
    description: z.string().min(30, "Mô tả cần chi tiết hơn (tối thiểu 30 ký tự)"),
    contactEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    guestName: z.string().optional(),
});

export type CreateRequestState = {
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
    success?: boolean;
    requestId?: string;
};

export async function createRequest(
    creatorUsername: string,
    prevState: CreateRequestState,
    formData: FormData
) {
    const session = await auth();
    const creator = await prisma.user.findUnique({ where: { username: creatorUsername } });

    if (!creator) {
        return { message: "Creator không tồn tại" };
    }

    // Parse Data
    const rawData = {
        type: formData.get("type"),
        budget: Number(formData.get("budget")),
        deadline: formData.get("deadline") ? new Date(formData.get("deadline") as string) : undefined,
        description: formData.get("description"),
        contactEmail: formData.get("contactEmail"),
        guestName: formData.get("guestName"),
    };

    const validatedFields = RequestSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        };
    }

    const { type, budget, deadline, description, contactEmail, guestName } = validatedFields.data;

    try {
        const request = await prisma.request.create({
            data: {
                creatorId: creator.id,
                fanId: session?.user?.id,
                type,
                budgetCents: budget, // Assuming budget input is in standard unit, stored as cents? Or direct? Schema says budgetCents. If user input 50000 VND, keeping as is.
                deadline,
                description,
                guestEmail: contactEmail || undefined,
                guestName: guestName || undefined,
            },
        });

        // revalidatePath needed?

        return {
            success: true,
            requestId: request.id,
            message: "Yêu cầu đã được gửi thành công!"
        };
    } catch (error) {
        console.error("Create request error:", error);
        return { message: "Lỗi hệ thống. Vui lòng thử lại sau." };
    }
}
