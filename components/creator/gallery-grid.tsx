"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Lock, PlayCircle, Image as ImageIcon, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
    id: string;
    url: string;
    type: string; // "IMAGE" | "VIDEO" from DB
    title: string | null;
    visibility: string; // "PUBLIC" | "MEMBERS" from DB
}

interface GalleryGridProps {
    items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [activeTab, setActiveTab] = useState("ALL");

    const filteredItems = items.filter(item => {
        if (activeTab === "ALL") return true;
        if (activeTab === "IMAGES") return item.type === "IMAGE";
        if (activeTab === "VIDEOS") return item.type === "VIDEO";
        return true;
    });

    const handleItemClick = (item: GalleryItem) => {
        // If locked (MEMBERS), functionality depends on Auth. 
        // For MVP, if MEMBERS -> Show Lock Alert or preventing opening full view?
        // Let's allow opening but show overlay if implementation requires.
        // Or simply open the lightbox regardless for now to show the "demo".
        setSelectedItem(item);
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                        <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                        <TabsTrigger value="IMAGES">Hình ảnh</TabsTrigger>
                        <TabsTrigger value="VIDEOS">Video</TabsTrigger>
                    </TabsList>
                </div>

                <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer border bg-muted"
                            onClick={() => handleItemClick(item)}
                        >
                            {/* Render Preview */}
                            {item.type === 'VIDEO' ? (
                                <div className="relative aspect-video">
                                    {/* Simple video thumbnail hack: use black bg or fetch thumb if possible. For now just placeholder style */}
                                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                                        <PlayCircle className="w-12 h-12 text-white/50" />
                                    </div>
                                    <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.title || "Gallery Item"}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            )}

                            {/* Overlay Info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <p className="text-white font-medium line-clamp-1">{item.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] text-white/80 border-white/20 h-5">
                                        {item.type}
                                    </Badge>
                                    {item.visibility === 'MEMBERS' && (
                                        <Badge variant="default" className="text-[10px] bg-amber-500 h-5">
                                            MEMBERS
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Icons always visible */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                {item.visibility === 'MEMBERS' && (
                                    <div className="bg-black/60 p-1.5 rounded-full text-amber-400 backdrop-blur-sm">
                                        <Lock className="w-3 h-3" />
                                    </div>
                                )}
                                {item.type === 'VIDEO' && (
                                    <div className="bg-black/60 p-1.5 rounded-full text-white backdrop-blur-sm">
                                        <PlayCircle className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Không có nội dung nào trong danh mục này.
                    </div>
                )}
            </Tabs>

            {/* Lightbox Dialog */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-[90vw] h-[90vh] p-0 bg-black/95 border-none flex flex-col items-center justify-center">
                    <DialogTitle className="sr-only">View Gallery Item</DialogTitle>
                    <div className="absolute top-4 right-4 z-50">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setSelectedItem(null)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {selectedItem && (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            {selectedItem.type === 'VIDEO' ? (
                                <video
                                    src={selectedItem.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full rounded-md shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={selectedItem.url}
                                    alt={selectedItem.title || "Full View"}
                                    className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                                />
                            )}

                            {/* Caption */}
                            <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                                <h3 className="text-white text-lg font-medium">{selectedItem.title}</h3>
                                {selectedItem.visibility === 'MEMBERS' && (
                                    <p className="text-amber-400 text-sm flex items-center justify-center gap-1 mt-1">
                                        <Lock className="w-3 h-3" /> Nội dung dành riêng cho thành viên
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
