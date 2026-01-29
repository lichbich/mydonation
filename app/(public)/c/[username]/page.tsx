import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorOverview } from "@/components/creator/creator-overview";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        return { title: "Creator không tồn tại" };
    }

    return {
        title: `${creator.name} (@${creator.username})`,
        description: creator.creatorBio || `Ủng hộ ${creator.name} trên MyDonation`,
        openGraph: {
            title: `${creator.name} | MyDonation`,
            description: creator.creatorBio || `Ủng hộ ${creator.name} trên MyDonation`,
            type: "profile",
        },
    };
}

export default async function CreatorPage({ params }: PageProps) {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        notFound();
    }

    return <CreatorOverview creator={creator} />;
}
