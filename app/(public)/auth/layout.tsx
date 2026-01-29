import Link from "next/link";
import { Heart } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center px-6 border-b border-border/40">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                        MyDonation
                    </span>
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}
