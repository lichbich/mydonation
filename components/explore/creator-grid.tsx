import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface CreatorGridProps {
    creators: any[];
    pagination: {
        total: number;
        pages: number;
        current: number;
    };
}

export function CreatorGrid({ creators, pagination }: CreatorGridProps) {
    if (creators.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Không tìm thấy Creator nào phù hợp.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/explore">Xóa bộ lọc</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creators.map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <Button
                        variant="outline"
                        disabled={pagination.current <= 1}
                        asChild={pagination.current > 1}
                    >
                        {pagination.current > 1 ? (
                            <Link href={`/explore?page=${pagination.current - 1}`}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Trước
                            </Link>
                        ) : (
                            <span className="flex items-center"><ChevronLeft className="mr-2 h-4 w-4" /> Trước</span>
                        )}
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Trang {pagination.current} / {pagination.pages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={pagination.current >= pagination.pages}
                        asChild={pagination.current < pagination.pages}
                    >
                        {pagination.current < pagination.pages ? (
                            <Link href={`/explore?page=${pagination.current + 1}`}>
                                Sau <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        ) : (
                            <span className="flex items-center">Sau <ChevronRight className="ml-2 h-4 w-4" /></span>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

function CreatorCard({ creator }: { creator: any }) {
    // Determine accent color
    const accentColor = creator.creatorProfile?.accentColor || '#3b82f6';

    return (
        <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col h-full">
            <div
                className="h-20 w-full bg-muted relative"
                style={{ backgroundColor: accentColor }}
            />

            <CardHeader className="relative pt-0 pb-2 flex-none">
                <div className="flex justify-between items-start">
                    <Avatar className="h-16 w-16 border-4 border-background -mt-8 shadow-sm">
                        <AvatarImage src={creator.image || ""} alt={creator.name || ""} />
                        <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Show badge if highly supported or verified later */}
                </div>
                <div className="mt-2">
                    <h3 className="font-bold text-lg truncate hover:text-primary transition-colors">
                        <Link href={`/c/${creator.username}`}>{creator.name}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <p className="text-sm text-foreground/80 line-clamp-2 min-h-[40px] mb-4">
                    {creator.creatorProfile?.headline || creator.bio || "Chưa có giới thiệu."}
                </p>

                {/* Stats or Tags */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {creator._count?.receivedSupport > 0 && (
                        <Badge variant="secondary" className="font-normal">
                            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500 border-none" />
                            {creator._count.receivedSupport} ủng hộ
                        </Badge>
                    )}
                    {creator.membershipTiers && creator.membershipTiers.length > 0 && (
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                            Membership
                        </Badge>
                    )}
                </div>

                {/* Mini Action Cards Preview */}
                {creator.actionCards && creator.actionCards.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Nổi bật</p>
                        <div className="grid grid-cols-2 gap-2">
                            {creator.actionCards.slice(0, 2).map((card: any) => (
                                <div key={card.id} className="bg-muted/30 rounded p-2 text-xs truncate border border-border/50">
                                    <span className="mr-1">{card.icon}</span>
                                    {card.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 flex-none bg-muted/20 p-4 border-t border-border/40">
                <Button asChild size="sm" className="w-full">
                    <Link href={`/c/${creator.username}`}>
                        Xem Profile
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
