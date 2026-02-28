"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Download, Image as ImageIcon, Tags, QrCode, Play, Music, ExternalLink, Heart } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

export default function YoutubeToolPage() {
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);
    const [isDonateAudioOpen, setIsDonateAudioOpen] = useState(false);
    const [pendingAudioUrl, setPendingAudioUrl] = useState("");

    const handleAudioDonateRequired = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        setPendingAudioUrl(url);
        setIsDonateAudioOpen(true);
    };

    const handleAnalyze = async () => {
        if (!youtubeLink) {
            toast.error("Vui lòng nhập link Youtube!");
            return;
        }
        if (!youtubeLink.includes("youtube.com") && !youtubeLink.includes("youtu.be")) {
            toast.error("Link Youtube không hợp lệ!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/youtube?url=${encodeURIComponent(youtubeLink)}`);
            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            setVideoData(data);
            toast.success("Phân tích video thành công!");
        } catch (error) {
            toast.error("Lỗi khi kết nối hoặc phân tích URL");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadFormat = (format: string) => {
        window.open(`https://ssyoutube.com/en?url=${encodeURIComponent(youtubeLink)}`, '_blank');
        toast.success(`Đang mở trình tải video để lấy định dạng ${format}...`);
    };

    const handleDirectDownloadImage = (url: string) => {
        // Simple direct download trick
        window.open(url, "_blank");
        toast.success("Mở hình ảnh tải về!");
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                    <Youtube className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Youtube Tools</h1>
                    <p className="text-muted-foreground">Tải video, lấy thumbnail, trích xuất tags và tạo mã QR</p>
                </div>
            </div>

            <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle>Dán link Youtube vào đây</CardTitle>
                    <CardDescription>Hỗ trợ link từ youtube.com hoặc youtu.be</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                            className="flex-1 bg-background h-12 text-lg"
                        />
                        <Button
                            size="lg"
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white h-12 px-8"
                        >
                            {isLoading ? "Đang xử lý..." : "Phân Tích"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {videoData && (
                <Tabs defaultValue="download" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 mb-6">
                        <TabsTrigger value="download" className="py-3 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Download className="mr-2 h-4 w-4" /> Tải Video/Audio
                        </TabsTrigger>
                        <TabsTrigger value="thumbnail" className="py-3 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <ImageIcon className="mr-2 h-4 w-4" /> Thumbnail
                        </TabsTrigger>
                        <TabsTrigger value="tags" className="py-3 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Tags className="mr-2 h-4 w-4" /> Extractor Tags
                        </TabsTrigger>
                        <TabsTrigger value="qrcode" className="py-3 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <QrCode className="mr-2 h-4 w-4" /> Tạo QR Code
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="download" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tải Video & Audio</CardTitle>
                                <CardDescription>Tải trực tiếp bằng máy chủ ẩn danh nội bộ, tốc độ cao không dính quảng cáo.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/3 aspect-video bg-muted rounded-xl overflow-hidden relative group border shadow-sm">
                                    <img src={videoData.thumbnail || `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="h-12 w-12 text-white fill-white/80" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center space-y-4">
                                    <h3 className="font-semibold text-lg line-clamp-2">{videoData.title}</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        {videoData.formats && videoData.formats.video?.length > 0 ? (
                                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center gap-2 font-semibold pb-2 border-b"><Download className="h-4 w-4" /> Video (Kèm Âm Thanh)</div>
                                                <div className="flex flex-col gap-2">
                                                    {videoData.formats.video.map((f: any) => (
                                                        <Button key={f.itag} asChild className="w-full text-md bg-red-600 hover:bg-red-700 text-white">
                                                            <Link href={`/api/youtube/download?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoData.id}`)}&itag=${f.itag}&format=${f.quality}`} target="_blank" download>
                                                                Tải {f.quality} (MP4)
                                                            </Link>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center gap-2 font-semibold pb-2 border-b"><Download className="h-4 w-4 text-red-500" /> Video (MP4)</div>
                                                <p className="text-sm text-muted-foreground">Không tìm thấy máy chủ cho định dạng MP4 có âm thanh.</p>
                                            </div>
                                        )}

                                        {videoData.formats && videoData.formats.audio?.length > 0 ? (
                                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center gap-2 font-semibold pb-2 border-b"><Music className="h-4 w-4 text-pink-500" /> <span className="text-pink-500">Âm Thanh Lossless (Cần Donate)</span></div>
                                                <div className="flex flex-col gap-2">
                                                    {videoData.formats.audio.slice(0, 2).map((f: any) => {
                                                        const url = `/api/youtube/download?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoData.id}`)}&itag=${f.itag}&format=audio`;
                                                        return (
                                                            <Button key={f.itag} asChild variant="secondary" className="w-full border shadow-sm">
                                                                <a href={url} onClick={(e) => handleAudioDonateRequired(e, url)}>
                                                                    Tải Audio {f.quality} (MP3)
                                                                </a>
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center gap-2 font-semibold pb-2 border-b"><Music className="h-4 w-4 text-pink-500" /> <span className="text-pink-500">Âm Thanh (Cần Donate)</span></div>
                                                <Button asChild variant="secondary" className="w-full border shadow-sm">
                                                    <a href={`/api/youtube/download?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoData.id}`)}&format=audio`} onClick={(e) => handleAudioDonateRequired(e, `/api/youtube/download?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoData.id}`)}&format=audio`)}>
                                                        Tải Âm Thanh (MP3)
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <Dialog open={isDonateAudioOpen} onOpenChange={setIsDonateAudioOpen}>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-pink-500 fill-pink-500" /> Mở khoá tính năng cao cấp</DialogTitle>
                                                <DialogDescription>
                                                    Để tải Âm Thanh Chất Lượng Cao, người dùng cần ủng hộ (donate) để giúp duy trì máy chủ. Cảm ơn bạn rất nhiều!
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-center py-4">
                                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                                    <QRCodeSVG value="https://example.com/donate" size={150} />
                                                </div>
                                            </div>
                                            <DialogFooter className="sm:justify-between items-center flex-row">
                                                <Button variant="ghost" onClick={() => setIsDonateAudioOpen(false)}>Quay lại</Button>
                                                <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg" onClick={() => setIsDonateAudioOpen(false)}>
                                                    <a href={pendingAudioUrl} download>Tôi đã ủng hộ, Tải Ngay</a>
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <p className="text-xs text-muted-foreground mt-2 italic shadow-sm p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
                                        *Hệ thống tự động sử dụng Endpoint Proxy của trang web để kéo trực tiếp luồng stream chất lượng cao nhất cho phép tải mà không cần tới phần mềm thứ ba.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="thumbnail" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ảnh bìa (Thumbnail)</CardTitle>
                                <CardDescription>Xem và tải xuống ảnh bìa ở các độ phân giải khác nhau</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border">
                                        <img src={`https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`} alt="Max Res Thumbnail" className="w-full object-cover" />
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <Button onClick={() => handleDirectDownloadImage(`https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`)} variant="outline">
                                            Mở Max Res (HD)
                                        </Button>
                                        <Button onClick={() => handleDirectDownloadImage(`https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`)} variant="outline">
                                            Mở Standard
                                        </Button>
                                        <Button onClick={() => handleDirectDownloadImage(`https://img.youtube.com/vi/${videoData.id}/default.jpg`)} variant="outline">
                                            Mở Kích Thước Nhỏ
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tags" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Từ khóa (Tags)</CardTitle>
                                <CardDescription>Danh sách các từ khóa được sử dụng trong video này</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {videoData.tags && videoData.tags.length > 0 ? (
                                    <>
                                        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-xl border border-border/50">
                                            {videoData.tags.map((tag: string, index: number) => (
                                                <span key={index} className="px-3 py-1 bg-background rounded-full text-sm font-medium border shadow-sm">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Button variant="secondary" onClick={() => {
                                                navigator.clipboard.writeText(videoData.tags.join(", "));
                                                toast.success("Đã copy toàn bộ tags!");
                                            }}>
                                                Copy Tất Cả Tags
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground border rounded-xl bg-muted/20">
                                        Video này không có hoặc không thể trích xuất tag.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="qrcode" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mã QR Video</CardTitle>
                                <CardDescription>Quét mã này để mở trực tiếp video trên điện thoại</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 inline-block" id="qrcode-container">
                                    <QRCodeSVG
                                        value={youtubeLink}
                                        size={250}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"H"}
                                        includeMargin={false}
                                        imageSettings={{
                                            src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/YouTube_social_white_squircle.svg",
                                            x: undefined,
                                            y: undefined,
                                            height: 50,
                                            width: 50,
                                            excavate: true,
                                            opacity: 1
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
