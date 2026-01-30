import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Define simplified type for props based on what fetch returns
type CreatorUser = {
    id: string;
    username: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    creatorProfile: {
        headline: string | null;
        accentColor: string;
    } | null;
    actionCards: {
        id: string;
        title: string;
        price: number;
        icon: string | null;
    }[];
};

interface FeaturedCreatorsProps {
    creators: any[]; // Using any temporarily to avoid strict type mismatch during dev, ideally CreatorUser[]
}

export function FeaturedCreatorsSection({ creators }: FeaturedCreatorsProps) {
    if (!creators || creators.length === 0) {
        return null; // Or show empty state
    }

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Creators Nổi Bật</h2>
                        <p className="text-muted-foreground">Khám phá và ủng hộ những tài năng hàng đầu.</p>
                    </div>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/explore">
                            Xem Tất Cả <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creators.map((creator) => (
                        <CreatorCard key={creator.id} creator={creator} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/explore">
                            Xem Tất Cả <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function CreatorCard({ creator }: { creator: CreatorUser }) {
    return (
        <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group">
            {/* Cover Color Strip (since we dont have real cover images for all in seed, rely on accent color or default) */}
            <div
                className="h-24 w-full bg-muted relative"
                style={{ backgroundColor: creator.creatorProfile?.accentColor || '#3b82f6' }}
            >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            <CardHeader className="relative pt-0 pb-2">
                <div className="flex justify-between items-start">
                    <Avatar className="h-20 w-20 border-4 border-background -mt-10 shadow-sm">
                        <AvatarImage src={creator.image || ""} alt={creator.name || ""} />
                        <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="mt-4 bg-yellow-500/10 text-yellow-500 border-none">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                    </Badge>
                </div>
                <div className="mt-2">
                    <h3 className="font-bold text-lg truncate">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <p className="text-sm text-foreground/80 line-clamp-2 min-h-[40px]">
                    {creator.creatorProfile?.headline || creator.bio || "Chưa có giới thiệu."}
                </p>

                {/* Mini Action Cards Preview */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {creator.actionCards.slice(0, 3).map((card) => (
                        <div
                            key={card.id}
                            className="bg-muted/50 rounded-lg p-2 text-center text-xs border border-transparent hover:border-primary/20 transition-colors"
                        >
                            <div className="text-lg mb-1">{card.icon || '🎁'}</div>
                            <div className="font-medium text-primary">
                                {formatCurrency(card.price)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button asChild className="w-full bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground shadow-none border-0 group-hover:bg-primary transition-all">
                    <Link href={`/c/${creator.username}`}>
                        Ghé Thăm Profile
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function FeaturedCreatorsSkeleton() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                        <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-24 w-full" />
                            <CardHeader className="pt-0 pb-2">
                                <Skeleton className="h-20 w-20 rounded-full -mt-10 border-4 border-background" />
                                <div className="mt-2 space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <Skeleton className="h-16 rounded-lg" />
                                    <Skeleton className="h-16 rounded-lg" />
                                    <Skeleton className="h-16 rounded-lg" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
