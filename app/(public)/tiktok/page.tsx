"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Download, TrendingUp, ShoppingBag, Search, Play, Star, BadgeCheck, AlertCircle, Heart } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function TikTokToolPage() {
    const [tiktokLink, setTiktokLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<any>(null);
    const [searchProduct, setSearchProduct] = useState("");
    const [isDonateVideoOpen, setIsDonateVideoOpen] = useState(false);
    const [pendingVideoUrl, setPendingVideoUrl] = useState("");

    const handleVideoDonateRequired = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        setPendingVideoUrl(url);
        setIsDonateVideoOpen(true);
    };

    const handleAnalyze = async () => {
        if (!tiktokLink) {
            toast.error("Vui lòng nhập link TikTok!");
            return;
        }
        if (!tiktokLink.includes("tiktok.com")) {
            toast.error("Link TikTok không hợp lệ!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/tiktok?url=${encodeURIComponent(tiktokLink)}`);
            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            setVideoData(data);
            toast.success("Đã tìm thấy tải dữ liệu video!");
        } catch (error) {
            toast.error("Lỗi khi kết nối hoặc phân tích URL");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadRedirect = (type: string) => {
        // Redirection to reliable third-party downloaders (SnapTik, etc)
        let dlLink = `https://snaptik.app/en?url=${encodeURIComponent(tiktokLink)}`;
        if (type === "MP3") {
            dlLink = `https://ssstik.io/download-tiktok-mp3?url=${encodeURIComponent(tiktokLink)}`;
        }
        window.open(dlLink, '_blank');
        toast.success(`Đang mở trình tải video để tải xuống...`);
    };

    // Mocks for trending tabs since those need separate APIs
    const trendingSongs = [
        { id: 1, name: "Magnetic", artist: "ILLIT", uses: "2.5M", trend: "+15%" },
        { id: 2, name: "APT.", artist: "ROSÉ & Bruno Mars", uses: "4.1M", trend: "+45%" },
        { id: 3, name: "Espresso", artist: "Sabrina Carpenter", uses: "1.8M", trend: "+5%" },
        { id: 4, name: "Woke Up", artist: "XG", uses: "850K", trend: "+20%" },
        { id: 5, name: "Cắt Đôi Nỗi Sầu", artist: "Tăng Duy Tân", uses: "3.2M", trend: "-2%" },
    ];

    const trendingProducts = [
        { id: 1, name: "Son Dưỡng Ẩm Môi Căng Mọng", shop: "Beauty Shop Official", price: "99.000đ", sold: "50.2K", rating: 4.8 },
        { id: 2, name: "Áo Phông Form Rộng Unisex", shop: "Streetwear VN", price: "159.000đ", sold: "120K", rating: 4.9 },
        { id: 3, name: "Bình Giữ Nhiệt 1000ml Inox 304", shop: "Gia Dụng Thông Minh", price: "85.000đ", sold: "35.5K", rating: 4.7 },
        { id: 4, name: "Tai Nghe Không Dây Bluetooth 5.3", shop: "Tech Store", price: "199.000đ", sold: "89K", rating: 4.6 },
    ];

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8 max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-border shadow-md">
                    <Music className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">TikTok Tools</h1>
                    <p className="text-muted-foreground">Tải video không logo, theo dõi trending và tìm kiếm sản phẩm hot</p>
                </div>
            </div>

            <Tabs defaultValue="downloader" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 mb-8 max-w-3xl">
                    <TabsTrigger value="downloader" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Download className="mr-2 h-4 w-4" /> Tải Video
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <TrendingUp className="mr-2 h-4 w-4" /> Trend Tracker
                    </TabsTrigger>
                    <TabsTrigger value="products" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Sản Phẩm Hot
                    </TabsTrigger>
                </TabsList>

                {/* Tab: Downloader */}
                <TabsContent value="downloader" className="space-y-6">
                    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle>Dán link video TikTok vào đây</CardTitle>
                            <CardDescription>Tìm và lấy dữ liệu video để chuẩn bị tải xuống MP4 / MP3</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    placeholder="https://www.tiktok.com/@username/video/..."
                                    value={tiktokLink}
                                    onChange={(e) => setTiktokLink(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                    className="flex-1 bg-background h-12 text-lg"
                                />
                                <Button
                                    size="lg"
                                    onClick={handleAnalyze}
                                    disabled={isLoading}
                                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 h-12 px-8"
                                >
                                    {isLoading ? "Đang xử lý..." : "Phân Tích"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {videoData && (
                        <Card className="overflow-hidden border border-border/50 animate-in slide-in-from-bottom-4 fade-in-50">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 max-w-[300px] aspect-[9/16] bg-muted relative group mx-auto md:mx-0">
                                    {videoData.thumbnail ? (
                                        <img src={videoData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                                            <AlertCircle className="h-8 w-8 mb-2" />
                                            <span>Ảnh bị chặn bởi TikTok, nhưng vẫn có thể tải video về.</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="h-12 w-12 text-white fill-white/80" />
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-center space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Music className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-semibold text-lg">@{videoData.author}</span>
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 md:line-clamp-4">{videoData.title}</p>
                                    </div>

                                    <div className="flex gap-4 text-sm font-medium">
                                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Play className="h-4 w-4 text-muted-foreground" /> {videoData.views}</div>
                                        <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Star className="h-4 w-4 text-pink-500 fill-pink-500" /> {videoData.likes}</div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                                        {videoData.playUrl && videoData.source === 'tikwm' ? (
                                            <>
                                                <Button asChild size="lg" className="w-full sm:w-auto text-md bg-pink-600 hover:bg-pink-700 text-white cursor-pointer group">
                                                    <a href={videoData.playUrl} onClick={(e) => handleVideoDonateRequired(e, videoData.playUrl)}>
                                                        <Heart className="mr-2 h-5 w-5 group-hover:fill-white/80" /> Tải VIP Không Logo (Cần Donate)
                                                    </a>
                                                </Button>
                                                {videoData.musicUrl && (
                                                    <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto cursor-pointer">
                                                        <a href={videoData.musicUrl} target="_blank" rel="noopener noreferrer">
                                                            <Music className="mr-2 h-5 w-5" /> Tải Chỉ Âm Thanh (MP3)
                                                        </a>
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={() => handleDownloadRedirect("MP4")} size="lg" className="w-full sm:w-auto text-md bg-green-600 hover:bg-green-700 text-white">
                                                    <Download className="mr-2 h-5 w-5" /> Tải Video Không Logo Tại SnapTik
                                                </Button>
                                                <Button onClick={() => handleDownloadRedirect("MP3")} size="lg" variant="secondary" className="w-full sm:w-auto">
                                                    <Music className="mr-2 h-5 w-5" /> Tải Âm Thanh (MP3) Tại SSS-Tik
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">
                                        * Nguồn dữ liệu trả về từ {videoData.source}.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Dialog open={isDonateVideoOpen} onOpenChange={setIsDonateVideoOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-pink-500 fill-pink-500" /> Mở khoá tính năng VIP</DialogTitle>
                                <DialogDescription>
                                    Để tải video TikTok chất lượng cao không logo trực tiếp, người dùng cần ủng hộ (donate) để giúp duy trì máy chủ. Cảm ơn bạn rất nhiều!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center py-4">
                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <QRCodeSVG value="https://example.com/tiktok-vip-donate" size={150} />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-between items-center flex-row">
                                <Button variant="ghost" onClick={() => setIsDonateVideoOpen(false)}>Quay lại</Button>
                                <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg" onClick={() => setIsDonateVideoOpen(false)}>
                                    <a href={pendingVideoUrl} target="_blank" rel="noopener noreferrer" download>Tôi đã ủng hộ, Mở Khoá Tải</a>
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Tab: Trend Tracker */}
                <TabsContent value="trends" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nhạc Đang Hot - 48h Qua</CardTitle>
                            <CardDescription>Cập nhật những bài hát được sử dụng nhiều nhất trên TikTok Việt Nam</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {trendingSongs.map((song, index) => (
                                    <div key={song.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg">{song.name}</h4>
                                                <span className="text-sm text-muted-foreground">{song.artist}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-right">
                                            <div className="hidden sm:block">
                                                <div className="text-sm font-medium">Lượt dùng</div>
                                                <div className="text-muted-foreground">{song.uses}</div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-sm font-medium ${song.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {song.trend}
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border border-border/50">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Products */}
                <TabsContent value="products" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>TikTok Shop Khám Phá</CardTitle>
                            <CardDescription>Tìm kiếm các sản phẩm bán chạy để tìm ý tưởng cho tiếp thị liên kết (Affiliate)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm tên sản phẩm hoặc ngành hàng..."
                                        value={searchProduct}
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                        className="pl-10 h-11"
                                    />
                                </div>
                                <Select defaultValue="sales">
                                    <SelectTrigger className="w-full sm:w-[180px] h-11">
                                        <SelectValue placeholder="Sắp xếp theo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sales">Bán chạy nhất</SelectItem>
                                        <SelectItem value="trending">Đang xu hướng</SelectItem>
                                        <SelectItem value="revenue">Doanh thu cao</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {trendingProducts.map((product) => (
                                    <div key={product.id} className="group flex flex-col bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                                        <div className="aspect-square bg-muted relative">
                                            {/* Dummy Image */}
                                            <div className="flex items-center justify-center w-full h-full text-4xl bg-slate-100 dark:bg-slate-800">
                                                📦
                                            </div>
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT🔥</div>
                                        </div>
                                        <div className="p-4 flex flex-1 flex-col">
                                            <h4 className="font-semibold line-clamp-2 mb-1">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                                <ShoppingBag className="h-3 w-3" /> {product.shop}
                                            </p>
                                            <div className="flex items-end justify-between mt-auto pt-2">
                                                <div className="text-primary font-bold text-lg">{product.price}</div>
                                                <div className="text-xs text-muted-foreground text-right">
                                                    <div>Đã bán {product.sold}</div>
                                                    <div className="flex items-center justify-end text-yellow-500">
                                                        <Star className="h-3 w-3 fill-yellow-500 mr-1" /> {product.rating}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
