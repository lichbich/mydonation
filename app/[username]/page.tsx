import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorProfileClient } from "./client";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        return {
            title: "Creator không tồn tại",
        };
    }

    return {
        title: `${creator.name} (@${creator.username})`,
        description: creator.creatorBio || creator.bio || `Ủng hộ ${creator.name} trên MyDonation`,
        openGraph: {
            title: `${creator.name} | MyDonation`,
            description: creator.creatorBio || creator.bio || `Ủng hộ ${creator.name} trên MyDonation`,
            type: "profile",
            images: creator.image ? [creator.image] : [],
        },
        twitter: {
            card: "summary",
            title: `${creator.name} | MyDonation`,
            description: creator.creatorBio || creator.bio || `Ủng hộ ${creator.name} trên MyDonation`,
        },
    };
}

export default async function CreatorPage({ params }: PageProps) {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        notFound();
    }

    return <CreatorProfileClient creator={creator} />;
}
