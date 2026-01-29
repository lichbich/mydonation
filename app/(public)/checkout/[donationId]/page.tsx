import { notFound, redirect } from "next/navigation";
import { PaymentSimulator } from "@/components/checkout/payment-simulator";
import prisma from "@/lib/prisma";

interface CheckoutPageProps {
    params: Promise<{ donationId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { donationId } = await params;

    const donation = await prisma.donation.findUnique({
        where: { id: donationId },
        include: {
            actionCard: true,
            creator: true,
            supporter: true,
        },
    });

    if (!donation) {
        notFound();
    }

    if (donation.status === "completed") {
        redirect("/checkout/success");
    }

    return <PaymentSimulator donation={donation} />;
}
