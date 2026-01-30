"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";
import { SupportModal } from "./support-modal";

interface ActionCardGridProps {
    creator: any;
    actionCards: any[];
}

export function ActionCardGrid({ creator, actionCards }: ActionCardGridProps) {
    const [selectedCard, setSelectedCard] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (card: any) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleSupportGeneral = () => {
        setSelectedCard(null);
        setIsModalOpen(true);
    };

    if (!actionCards || actionCards.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground">Creator chưa tạo Action Card nào.</p>
                <Button onClick={handleSupportGeneral} className="mt-4">
                    Ủng hộ tùy chọn
                </Button>
                <SupportModal
                    creatorId={creator.id}
                    creatorName={creator.name}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    actionCard={null}
                />
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actionCards.map((card) => (
                    <Card
                        key={card.id}
                        className={`relative overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group border-border/50 ${card.isFeatured ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/50'}`}
                        onClick={() => handleCardClick(card)}
                    >
                        {card.isFeatured && (
                            <div className="absolute top-3 right-3">
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                                    <Sparkles className="w-3 h-3 mr-1" /> Featured
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <div className="text-4xl mb-2">{card.icon || "🎁"}</div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {card.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {card.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-0 flex justify-between items-center">
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(card.price)}
                            </span>
                            <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <SupportModal
                creatorId={creator.id}
                creatorName={creator.name}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                actionCard={selectedCard}
            />

            {/* Floating CTA for Mobile / General Support */}
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
                <Button
                    size="lg"
                    className="rounded-full shadow-xl bg-gradient-to-r from-primary to-pink-600 h-14 px-6 animate-bounce-subtle"
                    onClick={handleSupportGeneral}
                >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Ủng hộ ngay
                </Button>
            </div>
        </>
    );
}

// Global CSS for animate-bounce-subtle needed? Tailwind `animate-bounce` is strong.
// Use standard bounce for now or none.
