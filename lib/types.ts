import { User, ActionCard, Donation } from "@prisma/client";

export type UserWithRelations = User & {
    actionCards?: ActionCard[];
    donations?: DonationWithRelations[];
    received?: DonationWithRelations[];
};

export type ActionCardWithRelations = ActionCard & {
    creator?: User;
    donations?: Donation[];
    _count?: {
        donations: number;
    };
};

export type DonationWithRelations = Donation & {
    actionCard?: ActionCard;
    supporter?: User | null;
    creator?: User;
};

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
    recentDonations: DonationWithRelations[];
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
