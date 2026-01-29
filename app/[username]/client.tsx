"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActionCard, ActionCardEmpty } from "@/components/cards/action-card";
import { DonationCard, DonationEmpty } from "@/components/cards/donation-card";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { CreatorProfile, ActionCardWithRelations } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Globe,
    Heart,
    Users,
    TrendingUp,
    Share2,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
    creator: {
        id: string;
        name: string | null;
        username: string;
        image: string | null;
        bio: string | null;
        creatorTitle: string | null;
        creatorBio: string | null;
        creatorCoverUrl: string | null;
        socialLinks: { twitter?: string; facebook?: string; instagram?: string; youtube?: string; website?: string } | null;
        actionCards: any[];
        recentDonations: any[];
        stats: { totalDonations: number; totalAmount: number; supporterCount: number };
    };
}

export function CreatorProfileClient({ creator }: Props) {
    const [selectedCard, setSelectedCard] = useState<ActionCardWithRelations | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handleSelectCard = (card: ActionCardWithRelations) => {
        setSelectedCard(card);
        setCheckoutOpen(true);
    };

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

    const socialLinks = creator.socialLinks || {};

    return (
        <div className="min-h-screen">
            {/* Cover */}
            <div className="h-48 md:h-64 bg-gradient-to-br from-primary/80 via-pink-500/80 to-purple-500/80 relative">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="pt-0 pb-6">
                                {/* Avatar */}
                                <div className="flex justify-center -mt-16 mb-4">
                                    <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                                        <AvatarImage src={creator.image || ""} alt={creator.name || ""} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-4xl">
                                            {creator.name?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Name & Username */}
                                <div className="text-center mb-4">
                                    <h1 className="text-2xl font-bold">{creator.name}</h1>
                                    <p className="text-muted-foreground">@{creator.username}</p>
                                    {creator.creatorTitle && (
                                        <Badge className="mt-2" variant="secondary">
                                            {creator.creatorTitle}
                                        </Badge>
                                    )}
                                </div>

                                {/* Bio */}
                                {creator.creatorBio && (
                                    <p className="text-center text-muted-foreground text-sm mb-6">
                                        {creator.creatorBio}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex justify-center mb-1">
                                            <Heart className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-lg font-bold">{creator.stats.totalDonations}</div>
                                        <div className="text-xs text-muted-foreground">Donations</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex justify-center mb-1">
                                            <Users className="h-4 w-4 text-pink-500" />
                                        </div>
                                        <div className="text-lg font-bold">{creator.stats.supporterCount}</div>
                                        <div className="text-xs text-muted-foreground">Supporters</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="flex justify-center mb-1">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="text-lg font-bold">
                                            {creator.stats.totalAmount >= 1000000
                                                ? `${(creator.stats.totalAmount / 1000000).toFixed(1)}M`
                                                : creator.stats.totalAmount >= 1000
                                                    ? `${(creator.stats.totalAmount / 1000).toFixed(0)}K`
                                                    : creator.stats.totalAmount}
                                        </div>
                                        <div className="text-xs text-muted-foreground">VND</div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                {Object.values(socialLinks).some(Boolean) && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="flex justify-center gap-3">
                                            {socialLinks.twitter && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="hover:text-[#1DA1F2]"
                                                >
                                                    <Link href={socialLinks.twitter} target="_blank">
                                                        <Twitter className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {socialLinks.facebook && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="hover:text-[#4267B2]"
                                                >
                                                    <Link href={socialLinks.facebook} target="_blank">
                                                        <Facebook className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {socialLinks.instagram && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="hover:text-[#E4405F]"
                                                >
                                                    <Link href={socialLinks.instagram} target="_blank">
                                                        <Instagram className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {socialLinks.youtube && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="hover:text-[#FF0000]"
                                                >
                                                    <Link href={socialLinks.youtube} target="_blank">
                                                        <Youtube className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {socialLinks.website && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="hover:text-primary"
                                                >
                                                    <Link href={socialLinks.website} target="_blank">
                                                        <Globe className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Share button */}
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={handleShare}
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Chia Sẻ
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Action Cards & Donations */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Action Cards */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Heart className="h-5 w-5 text-primary" />
                                Action Cards
                            </h2>
                            {creator.actionCards.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {creator.actionCards.map((card) => (
                                        <ActionCard
                                            key={card.id}
                                            actionCard={card}
                                            onSelect={handleSelectCard}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <ActionCardEmpty />
                            )}
                        </section>

                        {/* Recent Donations */}
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-pink-500" />
                                Ủng Hộ Gần Đây
                            </h2>
                            {creator.recentDonations.length > 0 ? (
                                <div className="space-y-3">
                                    {creator.recentDonations.map((donation) => (
                                        <DonationCard key={donation.id} donation={donation} />
                                    ))}
                                </div>
                            ) : (
                                <DonationEmpty />
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                actionCard={selectedCard}
                creatorName={creator.name || "Creator"}
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
            />
        </div>
    );
}
