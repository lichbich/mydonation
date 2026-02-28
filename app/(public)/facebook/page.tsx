"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Facebook, Play, AlertCircle, Film, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface VideoInfo {
    title: string;
    thumbnail: string;
    hdUrl: string | null;
    sdUrl: string | null;
}

export default function FacebookToolPage() {
    const [fbLink, setFbLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [videoData, setVideoData] = useState<VideoInfo | null>(null);

    const handleAnalyze = async () => {
        if (!fbLink.trim()) {
            toast.error("Please enter a Facebook video link!");
            return;
        }
        if (!fbLink.includes("facebook.com") && !fbLink.includes("fb.watch")) {
            toast.error("Invalid Facebook URL!");
            return;
        }

        setIsLoading(true);
        setVideoData(null);
        try {
            const res = await fetch(`/api/facebook?url=${encodeURIComponent(fbLink.trim())}`);
            const data = await res.json();

            if (!res.ok || data.error) {
                toast.error(data.error ?? "Failed to analyze video");
                return;
            }

            setVideoData(data);
            toast.success("Video found!");
        } catch {
            toast.error("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const buildDownloadUrl = (videoUrl: string, quality: string) => {
        const safeTitle = (videoData?.title ?? "facebook-video")
            .replace(/[\/\?<>\\:\*\|":]/g, "_")
            .trim()
            .slice(0, 80);
        return `/api/facebook/download?videoUrl=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeTitle}_${quality}.mp4`)}&quality=${quality}`;
    };

    return (
        <div className="container mx-auto py-10 px-4 sm:px-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-[#1877F2] text-white border border-border shadow-md">
                    <Facebook className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Facebook Video Downloader</h1>
                    <p className="text-muted-foreground">Download Facebook videos in HD or SD quality</p>
                </div>
            </div>

            {/* Input Card */}
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl mb-6">
                <CardHeader>
                    <CardTitle>Paste Facebook Video Link</CardTitle>
                    <CardDescription>
                        Supports Facebook videos, Reels, and Watch URLs (public videos only)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="https://www.facebook.com/watch?v=... or https://fb.watch/..."
                            value={fbLink}
                            onChange={(e) => setFbLink(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                            className="flex-1 bg-background h-12 text-base"
                        />
                        <Button
                            size="lg"
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="h-12 px-8 bg-[#1877F2] hover:bg-[#1460c7] text-white"
                        >
                            {isLoading ? "Analyzing..." : "Analyze"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Result Card */}
            {videoData && (
                <Card className="overflow-hidden border border-border/50 animate-in slide-in-from-bottom-4 fade-in-50">
                    <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                            {/* Thumbnail */}
                            <div className="w-full md:w-2/5 bg-muted relative group aspect-video md:aspect-auto min-h-[200px]">
                                {videoData.thumbnail ? (
                                    <img
                                        src={videoData.thumbnail}
                                        alt="Thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Film className="h-16 w-16 opacity-30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-12 w-12 text-white fill-white/80" />
                                </div>
                            </div>

                            {/* Info & Download */}
                            <div className="flex-1 p-6 flex flex-col justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 rounded-md bg-[#1877F2]/10">
                                            <Facebook className="h-4 w-4 text-[#1877F2]" />
                                        </div>
                                        <span className="text-sm text-muted-foreground font-medium">Facebook Video</span>
                                    </div>
                                    <h2 className="text-lg font-bold leading-snug line-clamp-3">
                                        {videoData.title}
                                    </h2>
                                </div>

                                {/* Download buttons */}
                                <div className="flex flex-col gap-3">
                                    {videoData.hdUrl ? (
                                        <Button
                                            asChild
                                            size="lg"
                                            className="w-full bg-[#1877F2] hover:bg-[#1460c7] text-white gap-2"
                                        >
                                            <a href={buildDownloadUrl(videoData.hdUrl, "HD")} download>
                                                <Download className="h-5 w-5" />
                                                Download HD (Best Quality)
                                                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">HD</span>
                                            </a>
                                        </Button>
                                    ) : null}

                                    {videoData.sdUrl ? (
                                        <Button
                                            asChild
                                            size="lg"
                                            variant={videoData.hdUrl ? "outline" : "default"}
                                            className={`w-full gap-2 ${!videoData.hdUrl ? "bg-[#1877F2] hover:bg-[#1460c7] text-white" : ""}`}
                                        >
                                            <a href={buildDownloadUrl(videoData.sdUrl, "SD")} download>
                                                <Download className="h-5 w-5" />
                                                Download SD (Standard Quality)
                                                <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">SD</span>
                                            </a>
                                        </Button>
                                    ) : null}

                                    {!videoData.hdUrl && !videoData.sdUrl && (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
                                            <AlertCircle className="h-5 w-5 shrink-0" />
                                            <p className="text-sm">No download links found. The video may be private.</p>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-muted-foreground italic">
                                    * Only works for public Facebook videos. Private or login-required videos cannot be downloaded.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* How it works */}
            {!videoData && !isLoading && (
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                    {[
                        { icon: Facebook, title: "Copy Link", desc: "Open a Facebook video and copy the URL from the browser address bar" },
                        { icon: Play, title: "Paste & Analyze", desc: "Paste the link above and click Analyze to fetch video info" },
                        { icon: Download, title: "Download", desc: "Choose HD or SD quality and click to download the video" },
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-5 rounded-xl bg-muted/30 border border-border/50 gap-3">
                            <div className="p-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2]">
                                <step.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold mb-1">{i + 1}. {step.title}</p>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
