import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default async function RequestSuccessPage({ params, searchParams }: { params: Promise<{ username: string }>, searchParams: Promise<{ id?: string }> }) {
    const { username } = await params;
    const { id } = await searchParams;

    return (
        <div className="container min-h-screen py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto px-4">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                <CheckCircle className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Yêu Cầu Đã Được Gửi!</h1>
            <p className="text-muted-foreground mb-8">
                Yêu cầu của bạn đã được gửi đến <strong>{username}</strong>.
                {id && <span className="block mt-2 font-mono bg-muted p-2 rounded text-sm">Mã yêu cầu: {id}</span>}
            </p>

            <div className="flex gap-4 w-full">
                <Button className="flex-1" variant="outline" asChild>
                    <Link href={`/c/${username}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Profile
                    </Link>
                </Button>
                {/* Future: Request Status tracking page */}
                <Button className="flex-1" disabled>
                    Theo dõi (Coming soon)
                </Button>
            </div>
        </div>
    );
}
