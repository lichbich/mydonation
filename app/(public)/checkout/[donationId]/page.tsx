import { notFound, redirect } from "next/navigation";
import { PaymentSimulator } from "@/components/checkout/payment-simulator";
import prisma from "@/lib/prisma";

interface CheckoutPageProps {
    params: Promise<{ donationId: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { donationId } = await params;

    const transaction = await prisma.supportTransaction.findUnique({
        where: { id: donationId },
        include: {
            actionCard: true,
            creator: true,
            fan: true,
        },
    });

    if (!transaction) {
        notFound();
    }

    if (transaction.status === "SUCCESS") { // status is pending success cancel
        redirect("/checkout/success"); // need to implement this page too or handle in simulator
    }

    // Map data to match PaymentSimulator expectation (which expects 'donation' object)
    const donationData = {
        id: transaction.id,
        amount: transaction.amountCents,
        creator: {
            name: transaction.creator.name,
            username: transaction.creator.username,
        }
    };

    return (
        <div className="container py-20 min-h-screen flex items-center justify-center">
            <PaymentSimulator donation={donationData} />
        </div>
    );
}
