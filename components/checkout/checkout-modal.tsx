"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ActionCardWithRelations } from "@/lib/types";
import { createDonation } from "@/lib/actions/donations";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Minus, Plus, Heart, Loader2 } from "lucide-react";

const DEFAULT_COLOR = "#6366f1";

interface CheckoutModalProps {
    actionCard: ActionCardWithRelations | null;
    creatorId: string;
    creatorName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({
    actionCard,
    creatorId,
    creatorName,
    open,
    onOpenChange,
}: CheckoutModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const totalAmount = actionCard ? actionCard.price * quantity : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!actionCard) return;

        setIsLoading(true);
        try {
            const result = await createDonation({
                creatorId,
                actionCardId: actionCard.id,
                amount: totalAmount,
                message: message || undefined,
                isAnonymous,
            });

            if ('error' in result && result.error) {
                toast.error(result.error as string);
                return;
            }

            if (result.donationId) {
                // Redirect to payment simulation page
                router.push(`/checkout/${result.donationId}`);
                onOpenChange(false);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset state when modal closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setQuantity(1);
            setMessage("");
            setIsAnonymous(false);
        }
        onOpenChange(newOpen);
    };

    if (!actionCard) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${DEFAULT_COLOR}20` }}
                        >
                            {actionCard.icon || "💝"}
                        </span>
                        {actionCard.title}
                    </DialogTitle>
                    <DialogDescription>
                        Ủng hộ <span className="font-medium text-foreground">{creatorName}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label>Số lượng</Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.min(100, quantity + 1))}
                                disabled={quantity >= 100}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Tổng tiền</p>
                        <p
                            className="text-2xl font-bold"
                            style={{ color: DEFAULT_COLOR }}
                        >
                            {formatCurrency(totalAmount)}
                        </p>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
                        <Textarea
                            id="message"
                            placeholder="Gửi lời nhắn đến creator..."
                            className="resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {/* Anonymous */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="rounded border-muted-foreground"
                        />
                        <Label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer">
                            Ủng hộ ẩn danh
                        </Label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                        style={{
                            backgroundColor: DEFAULT_COLOR,
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Heart className="mr-2 h-4 w-4" />
                                Tiến Hành Thanh Toán
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
