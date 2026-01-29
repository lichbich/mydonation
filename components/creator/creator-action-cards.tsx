"use client";

import { useState } from "react";
import { ActionCard, ActionCardEmpty } from "@/components/cards/action-card";
import { CheckoutModal } from "@/components/checkout/checkout-modal";

interface CreatorActionCardsProps {
    actionCards: any[];
    creatorName: string;
}

export function CreatorActionCards({ actionCards, creatorName }: CreatorActionCardsProps) {
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handleSelectCard = (card: any) => {
        setSelectedCard(card);
        setCheckoutOpen(true);
    };

    if (actionCards.length === 0) {
        return <ActionCardEmpty />;
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {actionCards.map((card) => (
                    <ActionCard
                        key={card.id}
                        actionCard={card}
                        onSelect={handleSelectCard}
                    />
                ))}
            </div>

            <CheckoutModal
                actionCard={selectedCard}
                creatorName={creatorName}
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
            />
        </>
    );
}
