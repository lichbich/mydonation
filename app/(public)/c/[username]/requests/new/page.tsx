import { notFound } from "next/navigation";
import { RequestCreationForm } from "@/components/requests/request-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function RequestPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const creator = await prisma.user.findUnique({
        where: { username },
        select: { id: true, name: true, username: true, image: true, role: true }
    });

    // Check if user exists and is a creator
    if (!creator || creator.role !== 'CREATOR') {
        notFound();
    }

    return (
        <div className="container max-w-3xl py-12 px-4 mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/c/${username}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Đặt Yêu Cầu (Request)</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>Gửi tới:</span>
                        <div className="flex items-center gap-1 font-medium text-foreground">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={creator.image || ""} />
                                <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {creator.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Intro Text */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 text-sm text-foreground/80">
                <p>
                    Bạn có ý tưởng hay dự án muốn hợp tác? Hãy điền thông tin chi tiết vào form dưới đây.
                    Creator sẽ xem xét và phản hồi yêu cầu của bạn sớm nhất có thể.
                </p>
            </div>

            {/* Form */}
            <RequestCreationForm creatorUsername={username} />
        </div>
    );
}
