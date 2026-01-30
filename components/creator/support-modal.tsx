"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createDonation } from "@/lib/actions/donations";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ActionCard {
    id: string;
    title: string;
    price: number;
    description?: string | null;
    icon?: string | null;
}

interface SupportModalProps {
    creatorId: string;
    creatorName: string;
    actionCard?: ActionCard | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PRESET_AMOUNTS = [20000, 50000, 100000, 200000, 500000];
const MIN_AMOUNT = 10000;

enum Step {
    SELECT = 1,
    DETAILS = 2,
    REVIEW = 3
}

export function SupportModal({ creatorId, creatorName, actionCard, open, onOpenChange }: SupportModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>(Step.SELECT);
    const [isLoading, setIsLoading] = useState(false);

    // Data State
    const [amount, setAmount] = useState<number>(50000);
    const [customAmount, setCustomAmount] = useState("");
    const [message, setMessage] = useState("");
    const [guestName, setGuestName] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Reset when modal opens/closes or actionCard changes
    useEffect(() => {
        if (open) {
            setStep(Step.SELECT); // Always start at step 1
            if (actionCard) {
                setAmount(actionCard.price);
                setMessage("");
            } else {
                setAmount(50000); // Default for general support
                setCustomAmount("");
                setMessage("");
            }
        }
    }, [open, actionCard]);

    const handleNext = () => {
        if (step === Step.SELECT) {
            if (amount < MIN_AMOUNT) {
                toast.error(`Số tiền tối thiểu là ${formatCurrency(MIN_AMOUNT)}`);
                return;
            }
            setStep(Step.DETAILS);
        } else if (step === Step.DETAILS) {
            if (message.length > 280) {
                toast.error("Tin nhắn tối đa 280 ký tự");
                return;
            }
            setStep(Step.REVIEW);
        }
    };

    const handleBack = () => {
        if (step > Step.SELECT) setStep(step - 1);
    };

    const handlePay = async () => {
        setIsLoading(true);
        try {
            const result = await createDonation({
                creatorId,
                actionCardId: actionCard?.id,
                amount,
                message,
                guestName: isAnonymous ? undefined : guestName,
                isAnonymous
            });

            if (result?.donationId) {
                onOpenChange(false);
                toast.success("Đang chuyển đến cổng thanh toán...");
                router.push(`/checkout/${result.donationId}`);
            } else {
                toast.error("Không thể tạo giao dịch");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi hệ thống");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] transition-all duration-300">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === Step.SELECT && `Ủng hộ ${creatorName}`}
                        {step === Step.DETAILS && "Thông tin lời nhắn"}
                        {step === Step.REVIEW && "Xác nhận ủng hộ"}
                    </DialogTitle>
                    <DialogDescription>
                        Bước {step}/3
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 min-h-[300px]">
                    {step === Step.SELECT && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {actionCard ? (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center space-y-2">
                                    <div className="text-4xl">{actionCard.icon || "🎁"}</div>
                                    <h3 className="font-bold text-lg">{actionCard.title}</h3>
                                    <p className="text-sm text-muted-foreground">{actionCard.description}</p>
                                    <div className="text-2xl font-bold text-primary mt-2">{formatCurrency(amount)}</div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Label>Chọn mức ủng hộ</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PRESET_AMOUNTS.map((val) => (
                                            <Button
                                                key={val}
                                                variant={amount === val && !customAmount ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => { setAmount(val); setCustomAmount(""); }}
                                                className="rounded-full"
                                            >
                                                {formatCurrency(val)}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hoặc nhập số tùy ý</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={customAmount || (amount === 0 ? '' : amount)}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setCustomAmount(e.target.value);
                                                    setAmount(isNaN(val) ? 0 : val);
                                                }}
                                                className="pl-4 text-xl font-bold h-12"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-4 top-3 text-muted-foreground font-bold">VND</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Tối thiểu {formatCurrency(MIN_AMOUNT)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === Step.DETAILS && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <Label htmlFor="message">Lời nhắn gửi đến Creator (280 ký tự)</Label>
                                <Textarea
                                    id="message"
                                    placeholder={`Gửi lời yêu thương đến ${creatorName}...`}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    maxLength={280}
                                    className="h-32 resize-none"
                                />
                                <div className="text-right text-xs text-muted-foreground">
                                    {message.length}/280
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Ẩn danh</Label>
                                        <p className="text-xs text-muted-foreground">Tên bạn sẽ hiển thị là "Ẩn danh"</p>
                                    </div>
                                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                </div>

                                {!isAnonymous && (
                                    <div className="space-y-2 animate-in fade-in height-auto">
                                        <Label htmlFor="guestName">Tên hiển thị (Tùy chọn)</Label>
                                        <Input
                                            id="guestName"
                                            placeholder="Tên của bạn"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === Step.REVIEW && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground">Người nhận</span>
                                    <span className="font-bold">{creatorName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground">Số tiền</span>
                                    <span className="font-bold text-xl text-primary">{formatCurrency(amount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Từ</span>
                                    <span className="font-medium">{isAnonymous ? "Người ẩn danh" : (guestName || "Guest")}</span>
                                </div>
                                {actionCard && (
                                    <div className="flex justify-between items-center pt-4 border-t border-border/40">
                                        <span className="text-muted-foreground">Action</span>
                                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{actionCard.title}</span>
                                    </div>
                                )}
                            </div>

                            {message && (
                                <div className="bg-muted p-4 rounded-xl italic text-sm text-foreground/80">
                                    "{message}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center sm:justify-between gap-4">
                    {step > Step.SELECT ? (
                        <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < Step.REVIEW ? (
                        <Button onClick={handleNext}>
                            Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handlePay} disabled={isLoading} className="bg-gradient-to-r from-primary to-pink-600 px-8">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4 fill-white/20" />}
                            Thanh Toán Ngay
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
