"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Heart } from "lucide-react";

interface DonationCardProps {
    donation: {
        id: string;
        amount: number;
        quantity: number;
        message?: string | null;
        isAnonymous: boolean;
        createdAt: Date;
        supporter?: {
            name?: string | null;
            image?: string | null;
        } | null;
        actionCard?: {
            emoji: string;
            title: string;
            color: string;
        };
    };
}

export function DonationCard({ donation }: DonationCardProps) {
    const supporterName = donation.isAnonymous
        ? "Ẩn danh"
        : donation.supporter?.name || "Khách";

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        {!donation.isAnonymous && donation.supporter?.image && (
                            <AvatarImage src={donation.supporter.image} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-primary/50 to-pink-500/50 text-white">
                            {donation.isAnonymous ? "?" : supporterName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{supporterName}</span>
                            {donation.actionCard && (
                                <span className="text-lg">{donation.actionCard.emoji}</span>
                            )}
                        </div>
                        <p
                            className="text-sm font-medium mb-1"
                            style={{ color: donation.actionCard?.color }}
                        >
                            {formatCurrency(donation.amount)}
                            {donation.quantity > 1 && ` x${donation.quantity}`}
                        </p>
                        {donation.message && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {donation.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(new Date(donation.createdAt))}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function DonationEmpty() {
    return (
        <Card className="border-dashed">
            <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Chưa có ủng hộ nào</p>
            </CardContent>
        </Card>
    );
}

export function DonationCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
