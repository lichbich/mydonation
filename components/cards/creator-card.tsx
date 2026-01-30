"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

interface CreatorCardProps {
    creator: {
        id: string;
        name: string;
        username: string;
        image?: string | null;
        bio?: string | null;
        creatorProfile?: {
            headline?: string | null;
        } | null;
        actionCards?: any[];
        _count?: { receivedSupport?: number };
    };
}

const DEFAULT_COLOR = "#6366f1";

export function CreatorCard({ creator }: CreatorCardProps) {
    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/30">
            {/* Cover gradient */}
            <div className="h-24 bg-gradient-to-br from-primary/80 via-pink-500/80 to-purple-500/80 relative">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
            </div>

            <CardContent className="relative pt-0 pb-6 px-6">
                {/* Avatar */}
                <Avatar className="h-20 w-20 -mt-10 ring-4 ring-background shadow-lg">
                    <AvatarImage src={creator.image || ""} alt={creator.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-2xl">
                        {creator.name?.charAt(0) || "?"}
                    </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="mt-3">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {creator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{creator.username}</p>

                    {creator.creatorProfile?.headline && (
                        <Badge variant="secondary" className="mt-2">
                            {creator.creatorProfile.headline}
                        </Badge>
                    )}

                    {creator.bio && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {creator.bio}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{creator._count?.receivedSupport || 0} ủng hộ</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>{creator.actionCards?.length || 0} Action Cards</span>
                    </div>
                </div>

                {/* Action Cards Preview */}
                {creator.actionCards && creator.actionCards.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        {creator.actionCards.slice(0, 3).map((card: any) => (
                            <div
                                key={card.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                style={{ backgroundColor: `${DEFAULT_COLOR}20` }}
                                title={card.title}
                            >
                                {card.icon || "💝"}
                            </div>
                        ))}
                        {creator.actionCards.length > 3 && (
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                +{creator.actionCards.length - 3}
                            </div>
                        )}
                    </div>
                )}

                {/* CTA */}
                <Button asChild className="w-full mt-4 group/btn" variant="outline">
                    <Link href={`/c/${creator.username}`}>
                        Xem Trang
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export function CreatorCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="h-24 bg-muted animate-pulse" />
            <CardContent className="relative pt-0 pb-6 px-6">
                <div className="h-20 w-20 rounded-full bg-muted animate-pulse -mt-10" />
                <div className="mt-3 space-y-2">
                    <div className="h-5 w-1/2 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded mt-3" />
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-10 w-full bg-muted animate-pulse rounded mt-4" />
            </CardContent>
        </Card>
    );
}
