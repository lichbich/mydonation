import { getCreatorGallery, getCreatorProfile } from "@/lib/actions/creators";
import { GalleryGrid } from "@/components/creator/gallery-grid";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `Thư viện hình ảnh - @${username}`,
        description: `Xem các khoảng khắc độc quyền của @${username}`,
    };
}

export default async function GalleryPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const items = await getCreatorGallery(username);
    const creator = await getCreatorProfile(username);

    if (!creator || items === null) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-8">
            <div className="container px-4 mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Button variant="ghost" className="mb-2 pl-0 hover:pl-2 transition-all text-muted-foreground" asChild>
                            <Link href={`/c/${username}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Profile
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold">Thư viện của {creator.name}</h1>
                        <p className="text-muted-foreground mt-1">
                            {items.length} Ảnh & Video
                        </p>
                    </div>
                </div>

                <GalleryGrid items={items} />
            </div>
        </div>
    );
}
