"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, QrCode, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// -----------------------------------------------
// Donation methods configuration
// Update these links when you have real payment URLs
// -----------------------------------------------
const DONATE_METHODS = [
    {
        id: "donate",
        name: "Donate Link",
        link: "https://abc.paypal.com/demo",   // TODO: replace with real donate link
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/30",
    },
];

// ---------- QR Popup for a single method ----------
function QrPopup({
    method,
    open,
    onClose,
}: {
    method: (typeof DONATE_METHODS)[0];
    open: boolean;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(method.link);
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm text-center">
                <DialogHeader className="items-center">
                    <DialogTitle className={`flex items-center gap-2 ${method.color}`}>
                        <QrCode className="h-5 w-5" />
                        Scan to Donate via {method.name}
                    </DialogTitle>
                    <DialogDescription>
                        Scan the QR code or click the link below to donate.
                    </DialogDescription>
                </DialogHeader>

                {/* QR Code */}
                <div className="flex justify-center py-2">
                    <div className="p-4 bg-white rounded-2xl shadow-md inline-block">
                        <QRCodeSVG
                            value={method.link}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                        />
                    </div>
                </div>


                {/* Action buttons */}
                <div className="flex gap-2 mt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                        asChild
                        size="sm"
                        className={`flex-1 gap-2 bg-gradient-to-r from-primary to-pink-600 border-0 text-white`}
                    >
                        <a href={method.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open Payment Page
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ---------- Main Donate Modal (full overview with all methods) ----------
export function DonateModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [qrTarget, setQrTarget] = useState<(typeof DONATE_METHODS)[0] | null>(null);

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="items-center text-center">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                            Buy Me a Coffee ☕
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            If you find these tools helpful, consider supporting me to keep the server running and add new features. Thank you so much!
                        </DialogDescription>
                    </DialogHeader>

                    {/* QR preview (first method as default) */}
                    <div className="flex justify-center py-1">
                        <div className="p-4 bg-white rounded-2xl shadow-md inline-block">
                            <QRCodeSVG
                                value={DONATE_METHODS[0].link}
                                size={160}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                    </div>

                    {/* Method cards */}
                    <div className="space-y-3">
                        {DONATE_METHODS.map((method) => (
                            <div
                                key={method.id}
                                className={`flex items-center justify-between p-3 rounded-xl border ${method.bgColor} ${method.borderColor}`}
                            >
                                <div className="space-y-0.5">
                                    <p className={`font-semibold text-sm ${method.color}`}>{method.name}</p>
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5 text-xs h-8"
                                        onClick={() => { onClose(); setQrTarget(method); }}
                                    >
                                        <QrCode className="h-3.5 w-3.5" />
                                        Show QR
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="gap-1.5 text-xs h-8 bg-gradient-to-r from-primary to-pink-600 border-0 text-white"
                                    >
                                        <a href={method.link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            Donate
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Per-method QR popup */}
            {qrTarget && (
                <QrPopup
                    method={qrTarget}
                    open={!!qrTarget}
                    onClose={() => setQrTarget(null)}
                />
            )}
        </>
    );
}

// ---------- Inline donate card for homepage (no modal) ----------
export function DonateInlineCard() {
    const [qrTarget, setQrTarget] = useState<(typeof DONATE_METHODS)[0] | null>(null);

    return (
        <>
            <div className="grid sm:grid-cols-2 gap-4 relative z-10 text-left">
                {DONATE_METHODS.map((method) => (
                    <div
                        key={method.id}
                        className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50 space-y-2"
                    >
                        <p className={`font-semibold ${method.color}`}>{method.name}</p>

                        {/* Action row */}
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href={method.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 ${method.color} hover:opacity-80 transition-opacity`}
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Pay Now
                            </a>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto gap-1.5 text-xs h-7 px-2"
                                onClick={() => setQrTarget(method)}
                            >
                                <QrCode className="h-3 w-3" />
                                QR Code
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {qrTarget && (
                <QrPopup
                    method={qrTarget}
                    open={!!qrTarget}
                    onClose={() => setQrTarget(null)}
                />
            )}
        </>
    );
}
