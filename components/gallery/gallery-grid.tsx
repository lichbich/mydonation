"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, Image as ImageIcon, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface GalleryItem {
    id: string;
    type: string; // "IMAGE" | "VIDEO"
    title: string | null;
    url: string;
    visibility: string;
    isLocked: boolean;
}

interface GalleryGridProps {
    items: GalleryItem[];
    creatorUsername: string;
    membershipTier?: any; // Lowest tier for CTA
}

type FilterType = "ALL" | "IMAGE" | "VIDEO";

export function GalleryGrid({ items, creatorUsername, membershipTier }: GalleryGridProps) {
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    const filteredItems = items.filter(item => {
        if (filter === "ALL") return true;
        return item.type === filter;
    });

    const handleItemClick = (item: GalleryItem) => {
        if (item.isLocked) {
            setSelectedItem(item);
            setIsUpgradeOpen(true);
        } else {
            setSelectedItem(item);
            setIsLightboxOpen(true);
        }
    };

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex items-center gap-2">
                <Button
                    variant={filter === "ALL" ? "default" : "outline"}
                    onClick={() => setFilter("ALL")}
                    size="sm"
                    className="rounded-full"
                >
                    Tất cả
                </Button>
                <Button
                    variant={filter === "IMAGE" ? "default" : "outline"}
                    onClick={() => setFilter("IMAGE")}
                    size="sm"
                    className="rounded-full"
                >
                    <ImageIcon className="mr-2 h-4 w-4" /> Ảnh
                </Button>
                <Button
                    variant={filter === "VIDEO" ? "default" : "outline"}
                    onClick={() => setFilter("VIDEO")}
                    size="sm"
                    className="rounded-full"
                >
                    <PlayCircle className="mr-2 h-4 w-4" /> Video
                </Button>
            </div>

            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        className="break-inside-avoid relative group rounded-xl overflow-hidden bg-muted cursor-pointer"
                        onClick={() => handleItemClick(item)}
                    >
                        {/* Media content */}
                        <div className={`relative ${item.isLocked ? 'blur-md scale-110' : ''} transition-all duration-500`}>
                            {/* Since seeded items are mostly images (picsum), using img tag. Even if video type, seed data has image url mostly. 
                                 Check seed data: type='IMAGE' for all seed except maybe type='VIDEO' but url is youtube/picsum. 
                                 For real video, use video tag or thumbnail. 
                                 Assuming image thumbnail for grid for simplicity.
                             */}
                            <img
                                src={item.url}
                                alt={item.title || "Gallery item"}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Lock Overlay */}
                        {item.isLocked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div className="h-10 w-10 bg-black/50 rounded-full flex items-center justify-center text-white mb-2">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Badge variant="secondary" className="bg-amber-500 text-white border-none">Members Only</Badge>
                            </div>
                        )}

                        {/* Icon Type Indicator */}
                        {!item.isLocked && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-none">
                                    {item.type === 'VIDEO' ? <PlayCircle className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                </Badge>
                            </div>
                        )}

                        {/* Title (if unlocked or even locked) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium truncate">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-4xl w-full p-0 bg-black/90 border-none overflow-hidden h-[80vh] flex items-center justify-center">
                    <DialogTitle className="sr-only">Xem chi tiết</DialogTitle>
                    <DialogDescription className="sr-only">Xem ảnh/video</DialogDescription>

                    <div className="relative w-full h-full flex items-center justify-center">
                        {selectedItem && (
                            <img
                                src={selectedItem.url}
                                alt={selectedItem.title || ""}
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upgrade Modal */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-600">
                            <Lock className="h-5 w-5" />
                            Nội dung dành cho Members
                        </DialogTitle>
                        <DialogDescription>
                            Hình ảnh/Video này chỉ dành cho thành viên của <strong>{creatorUsername}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {membershipTier ? (
                            <div className="bg-muted p-4 rounded-xl border border-border/50 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Gói Membership bắt đầu từ</p>
                                <p className="text-2xl font-bold text-primary mb-4">{formatCurrency(membershipTier.priceMonthlyCents)} / tháng</p>
                                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                                    <Link href={`/c/${creatorUsername}/membership`}>
                                        Đăng Ký Membership Ngay
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Button className="w-full" asChild>
                                <Link href={`/c/${creatorUsername}/membership`}>
                                    Xem Các Gói Membership
                                </Link>
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
