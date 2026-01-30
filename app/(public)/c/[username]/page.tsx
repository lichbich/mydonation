import { notFound } from "next/navigation";
import { getCreatorProfile } from "@/lib/actions/creators";
import { CreatorBio } from "@/components/creator/creator-hero";
import { ActionCardGrid } from "@/components/creator/action-card-grid";
import { RecentSupporters, PostPreviewList, GalleryPreviewGrid, MembershipTeaser } from "@/components/creator/creator-sections";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) return { title: 'Creator Not Found' };

    return {
        title: `${creator.name} (@${creator.username}) | MyDonation`,
        description: creator.creatorProfile?.headline || creator.bio || `Ủng hộ ${creator.name} trên MyDonation`,
        openGraph: {
            title: `${creator.name} - Creator trên MyDonation`,
            description: creator.creatorProfile?.headline || creator.bio || "Tham gia cộng đồng và ủng hộ creator yêu thích của bạn.",
            images: [
                {
                    url: creator.creatorProfile?.coverImage || creator.image || "https://mydonation.com/og-default.png", // Fallback URL
                    width: 1200,
                    height: 630,
                    alt: creator.name,
                }
            ],
            type: 'profile',
            username: creator.username,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${creator.name} on MyDonation`,
            description: creator.creatorProfile?.headline || creator.bio || "",
            images: [creator.creatorProfile?.coverImage || creator.image || ""],
        }
    };
}

export default async function CreatorPage({ params }: { params: Promise<{ username: string }> }) {
    // Await params in Next.js 15+
    const { username } = await params;
    const creator = await getCreatorProfile(username);

    if (!creator) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <CreatorBio bio={creator.bio} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-8 w-1 bg-primary rounded-full"></span>
                            <h2 className="text-2xl font-bold">Ủng Hộ & Tương Tác</h2>
                        </div>
                        <ActionCardGrid
                            creator={creator}
                            actionCards={creator.actionCards}
                        />
                    </section>

                    {creator.membershipTiers && creator.membershipTiers.length > 0 && (
                        <MembershipTeaser tiers={creator.membershipTiers} creatorUsername={creator.username} />
                    )}

                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="h-8 w-1 bg-pink-500 rounded-full"></span>
                            <h2 className="text-2xl font-bold">Bài Viết Mới</h2>
                        </div>
                        <PostPreviewList posts={creator.posts || []} creatorUsername={creator.username} />
                    </section>
                </div>

                {/* Right Column: Sidebar info */}
                <div className="space-y-8">
                    <RecentSupporters supporters={creator.recentSupport || []} />

                    <GalleryPreviewGrid items={creator.galleryItems || []} creatorUsername={creator.username} />

                    {/* Stats (Optional) */}
                    {creator.stats && (
                        <div className="bg-muted/10 p-6 rounded-xl border border-border/50 text-center">
                            <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider mb-4">Thành tựu</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary">{creator.stats.totalDonations}</p>
                                    <p className="text-xs text-muted-foreground">Lượt ủng hộ</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary">{creator.stats.supporterCount}</p>
                                    <p className="text-xs text-muted-foreground">Supporters</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
