import { notFound } from "next/navigation";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorHeader } from "@/components/creator/creator-header";
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
            <CreatorHeader creator={creator} />
            <div className="container mx-auto px-4 -mt-6 relative z-10 pb-12">
                <CreatorTabs username={username} />
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
