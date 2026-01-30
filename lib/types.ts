import { User, ActionCard, SupportTransaction } from "@prisma/client";

export type UserWithRelations = User & {
    actionCards?: ActionCard[];
    sentSupport?: SupportTransactionWithRelations[];
    receivedSupport?: SupportTransactionWithRelations[];
};

export type ActionCardWithRelations = ActionCard & {
    creator?: User;
    transactions?: SupportTransaction[];
    _count?: {
        transactions: number;
    };
};

export type SupportTransactionWithRelations = SupportTransaction & {
    actionCard?: ActionCard;
    fan?: User | null;
    creator?: User;
};

// Alias for backward compatibility
export type DonationWithRelations = SupportTransactionWithRelations;

export type CreatorProfile = {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    bio: string | null;
    creatorTitle: string | null;
    creatorBio: string | null;
    creatorCoverUrl: string | null;
    socialLinks: SocialLinks | null;
    actionCards: ActionCardWithRelations[];
    recentDonations: SupportTransactionWithRelations[];
    stats: CreatorStats;
};

export type CreatorStats = {
    totalDonations: number;
    totalAmount: number;
    supporterCount: number;
};

export type SocialLinks = {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
};

export type PaymentStatus = "pending" | "completed" | "cancelled" | "refunded";

export type CheckoutData = {
    actionCardId: string;
    quantity: number;
    message?: string;
    isAnonymous: boolean;
    supporterEmail?: string;
    supporterName?: string;
};

