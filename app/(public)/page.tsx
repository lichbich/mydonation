import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Youtube, Music, Heart, Coffee, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DonateInlineCard } from "@/components/donate-modal";

export const metadata: Metadata = {
    title: "My Tools & Donation - Hello!",
    description: "A collection of useful tools and an option to donate to me.",
};

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen py-10 px-4 sm:px-8 container mx-auto gap-12">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-background bg-muted flex items-center justify-center">
                        <Heart className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Hello! I make <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">Little Tools</span>
                </h1>
                <p className="max-w-[600px] text-lg sm:text-xl text-muted-foreground">
                    I created this website to provide free, useful tools for everyone.
                    If you find it helpful, please consider buying me a coffee! ❤️
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-pink-600 border-0">
                        <Link href="#donate">
                            <Heart className="mr-2 h-5 w-5 fill-white/20" />
                            Donate to Me
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm border-border">
                        <Link href="#tools">
                            <Coffee className="mr-2 h-5 w-5" />
                            Explore Tools
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Tools Section */}
            <section id="tools" className="flex flex-col items-center py-10">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                    <Coffee className="h-8 w-8 text-primary" />
                    My Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <Card className="group overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                                    <Youtube className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Youtube Tools</CardTitle>
                                    <CardDescription>Download videos, audios, thumbnails</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1">
                            <p className="text-muted-foreground text-sm">
                                Support downloading high-quality YouTube videos, converting videos to mp3,
                                extracting video tags, downloading and resizing thumbnails, generating QR codes for videos.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full group-hover:bg-primary" variant="secondary">
                                <Link href="/youtube">
                                    Use Now <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="group overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-slate-800 text-slate-100 dark:bg-slate-100 dark:text-slate-900">
                                    <Music className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>TikTok Tools</CardTitle>
                                    <CardDescription>Download logo-free videos, Trend tracker</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1">
                            <p className="text-muted-foreground text-sm">
                                Download TikTok videos without watermark, see trending songs in the last 48 hours,
                                track trending products on TikTok Shop.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full group-hover:bg-primary" variant="secondary">
                                <Link href="/tiktok">
                                    Use Now <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Donation Section */}
            <section id="donate" className="flex flex-col items-center py-10 pb-20">
                <div className="w-full max-w-2xl bg-gradient-to-br from-primary/10 to-pink-600/10 rounded-3xl p-8 sm:p-12 border border-primary/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -trate-y-1/4 translate-x-1/4">
                        <Heart className="w-64 h-64 text-primary/5 rotate-12" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 relative z-10 flex items-center justify-center gap-2">
                        <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
                        Buy Me a Coffee
                    </h2>
                    <p className="text-muted-foreground mb-8 relative z-10">
                        If you find these tools helpful and want to support me to maintain the server
                        and upgrade new features... you can donate to me via the information below. Thank you very much!
                    </p>

                    <DonateInlineCard />
                </div>
            </section>
        </div>
    );
}
