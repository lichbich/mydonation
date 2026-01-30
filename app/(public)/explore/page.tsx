import { exploreCreators } from "@/lib/actions/creators";
import { FilterBar } from "@/components/explore/filter-bar";
import { CreatorGrid } from "@/components/explore/creator-grid";
import { Suspense } from "react";

export const metadata = {
    title: "Khám phá Creators - MyDonation",
    description: "Tìm kiếm các creator tài năng và ủng hộ họ.",
};

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const q = typeof params.q === 'string' ? params.q : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;
    const hasMembership = params.hasMembership === 'true';
    const hasFeatured = params.hasFeatured === 'true';

    const data = await exploreCreators({
        page,
        q,
        sort,
        hasMembership,
        hasFeatured
    });

    return (
        <div className="container py-12 mx-auto px-4 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Khám Phá Cộng Đồng</h1>
                <p className="text-muted-foreground">Tìm kiếm các creator tài năng và ủng hộ họ.</p>
            </div>

            <FilterBar />

            <Suspense key={JSON.stringify(params)} fallback={<ExploreSkeleton />}>
                <CreatorGrid creators={data.creators} pagination={data.pagination} />
            </Suspense>
        </div>
    );
}

function ExploreSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="rounded-xl border border-border/50 bg-card overflow-hidden h-[380px]">
                    <div className="h-20 bg-muted animate-pulse" />
                    <div className="p-4 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted animate-pulse -mt-12 border-4 border-background" />
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-16 w-full bg-muted animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
