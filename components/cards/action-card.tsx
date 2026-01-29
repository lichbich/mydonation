"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionCardWithRelations } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface ActionCardProps {
    actionCard: ActionCardWithRelations;
    onSelect?: (card: ActionCardWithRelations) => void;
    showStats?: boolean;
}

export function ActionCard({ actionCard, onSelect, showStats = false }: ActionCardProps) {
    return (
        <Card
            className="group relative overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-card/50"
            style={{
                boxShadow: `0 4px 20px ${actionCard.color}20`,
            }}
            onClick={() => onSelect?.(actionCard)}
        >
            {/* Gradient overlay */}
            <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                    background: `linear-gradient(135deg, ${actionCard.color}40, transparent)`,
                }}
            />

            <CardContent className="relative p-6">
                {/* Emoji */}
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${actionCard.color}20` }}
                >
                    {actionCard.emoji}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {actionCard.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {actionCard.description}
                </p>

                {/* Price & Stats */}
                <div className="flex items-center justify-between">
                    <span
                        className="text-lg font-bold"
                        style={{ color: actionCard.color }}
                    >
                        {formatCurrency(actionCard.price)}
                    </span>
                    {showStats && actionCard._count && (
                        <span className="text-xs text-muted-foreground">
                            {actionCard._count.donations} lượt ủng hộ
                        </span>
                    )}
                </div>

                {/* Hover button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-card via-card to-transparent">
                    <Button
                        className="w-full"
                        style={{
                            backgroundColor: actionCard.color,
                            color: "white",
                        }}
                    >
                        Ủng Hộ Ngay
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function ActionCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse mb-4" />
                <div className="h-5 w-2/3 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-full bg-muted animate-pulse rounded mb-1" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-4" />
                <div className="h-6 w-1/3 bg-muted animate-pulse rounded" />
            </CardContent>
        </Card>
    );
}

export function ActionCardEmpty() {
    return (
        <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-3xl mx-auto mb-4">
                    ➕
                </div>
                <p className="text-muted-foreground">
                    Chưa có Action Card nào
                </p>
            </CardContent>
        </Card>
    );
}
