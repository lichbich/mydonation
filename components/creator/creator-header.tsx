"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, TrendingUp, Share2 } from "lucide-react";
import { toast } from "sonner";

interface CreatorHeaderProps {
    creator: {
        id: string;
        name: string | null;
        username: string;
        image: string | null;
        creatorTitle: string | null;
        creatorBio: string | null;
        stats: {
            totalDonations: number;
            totalAmount: number;
            supporterCount: number;
        };
    };
}

export function CreatorHeader({ creator }: CreatorHeaderProps) {
    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${creator.name} | MyDonation`,
                    text: `Ủng hộ ${creator.name} trên MyDonation!`,
                    url,
                });
            } catch (error) {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success("Đã sao chép link!");
        }
    };

    const formatAmount = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    };

    return (
        <div className="relative">
            {/* Cover */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-primary/80 via-pink-500/80 to-purple-500/80 relative">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
            </div>

            {/* Profile Card */}
            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl mx-auto md:mx-0">
                            <AvatarImage src={creator.image || ""} alt={creator.name || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-4xl">
                                {creator.name?.charAt(0) || "?"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold">{creator.name}</h1>
                                {creator.creatorTitle && (
                                    <Badge variant="secondary">{creator.creatorTitle}</Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground mb-4">@{creator.username}</p>
                            {creator.creatorBio && (
                                <p className="text-muted-foreground max-w-xl mb-4">
                                    {creator.creatorBio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-primary" />
                                    <span className="font-bold">{creator.stats.totalDonations}</span>
                                    <span className="text-sm text-muted-foreground">donations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-pink-500" />
                                    <span className="font-bold">{creator.stats.supporterCount}</span>
                                    <span className="text-sm text-muted-foreground">supporters</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="font-bold">₫{formatAmount(creator.stats.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 items-center md:items-end">
                            <Button onClick={handleShare} variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Chia Sẻ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
