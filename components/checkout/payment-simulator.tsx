"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { simulatePayment } from "@/lib/actions/donations";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, CreditCard, Shield } from "lucide-react";

interface PaymentSimulatorProps {
    donationId: string;
    amount: number;
    creatorName: string;
    creatorUsername: string;
}

export function PaymentSimulator({
    donationId,
    amount,
    creatorName,
    creatorUsername,
}: PaymentSimulatorProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "cancelled">("idle");

    const handlePayment = async (action: "success" | "cancel") => {
        setIsProcessing(true);

        // Simulate payment delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const result = await simulatePayment(donationId, action);

        if (result.error) {
            toast.error(result.error);
            setIsProcessing(false);
            return;
        }

        setStatus(action === "success" ? "success" : "cancelled");
        setIsProcessing(false);

        if (action === "success") {
            toast.success("Thanh toán thành công!");
        } else {
            toast.info("Đã hủy thanh toán");
        }
    };

    if (status === "success") {
        return (
            <Card className="max-w-md mx-auto border-green-500/50">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Thanh Toán Thành Công!</h2>
                    <p className="text-muted-foreground mb-6">
                        Cảm ơn bạn đã ủng hộ <strong>{creatorName}</strong>!
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push(`/${creatorUsername}`)} className="flex-1">
                            Quay Lại Trang Creator
                        </Button>
                        <Button onClick={() => router.push("/")} className="flex-1">
                            Về Trang Chủ
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (status === "cancelled") {
        return (
            <Card className="max-w-md mx-auto border-red-500/50">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Đã Hủy Thanh Toán</h2>
                    <p className="text-muted-foreground mb-6">
                        Bạn đã hủy thanh toán. Không có khoản phí nào được trừ.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => router.push(`/${creatorUsername}`)} className="flex-1">
                            Quay Lại
                        </Button>
                        <Button onClick={() => setStatus("idle")} className="flex-1">
                            Thử Lại
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center border-b">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Thanh toán an toàn</span>
                </div>
                <CardTitle>Xác Nhận Thanh Toán</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Amount */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-pink-500/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Số tiền thanh toán</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(amount)}</p>
                </div>

                {/* Mock Card Input */}
                <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-dashed bg-muted/30">
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium">Thẻ Test</span>
                        </div>
                        <div className="font-mono text-lg tracking-wider">
                            4242 4242 4242 4242
                        </div>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>12/28</span>
                            <span>123</span>
                        </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                        🧪 Đây là môi trường test. Không có giao dịch thật nào được thực hiện.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handlePayment("cancel")}
                        disabled={isProcessing}
                        className="flex-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={() => handlePayment("success")}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Thanh Toán"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
