"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DonationCard, DonationEmpty } from "@/components/cards/donation-card";
import { ActionCard, ActionCardEmpty } from "@/components/cards/action-card";
import { Heart, Users } from "lucide-react";

interface CreatorOverviewProps {
    creator: {
        actionCards: any[];
        recentDonations: any[];
        name: string | null;
    };
}

export function CreatorOverview({ creator }: CreatorOverviewProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Action Cards */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Ủng Hộ {creator.name}
                </h2>
                {creator.actionCards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {creator.actionCards.slice(0, 4).map((card: any) => (
                            <ActionCard key={card.id} actionCard={card} />
                        ))}
                    </div>
                ) : (
                    <ActionCardEmpty />
                )}
            </div>

            {/* Recent Donations */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-500" />
                    Ủng Hộ Gần Đây
                </h2>
                {creator.recentDonations.length > 0 ? (
                    <div className="space-y-3">
                        {creator.recentDonations.slice(0, 5).map((donation: any) => (
                            <DonationCard key={donation.id} donation={donation} />
                        ))}
                    </div>
                ) : (
                    <DonationEmpty />
                )}
            </div>
        </div>
    );
}
