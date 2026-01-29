import { notFound } from "next/navigation";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorActionCards } from "@/components/creator/creator-action-cards";

export const metadata = {
    title: "Ủng Hộ",
};

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function CreatorSupportPage({ params }: PageProps) {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Ủng Hộ {creator.name}</h2>
            <CreatorActionCards
                actionCards={creator.actionCards}
                creatorName={creator.name || "Creator"}
            />
        </div>
    );
}
