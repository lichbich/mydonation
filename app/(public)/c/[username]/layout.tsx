import { notFound } from "next/navigation";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorHero } from "@/components/creator/creator-hero";
import { CreatorTabs } from "@/components/creator/creator-tabs";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ username: string }>;
}

export default async function CreatorLayout({ children, params }: LayoutProps) {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <CreatorHero user={creator} />
            <div className="container mx-auto px-4 relative z-10 pb-12">
                <CreatorTabs username={username} />
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
