import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Image as ImageIcon, MessageSquare, PlayCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function RecentSupporters({ supporters }: { supporters: any[] }) {
    if (!supporters || supporters.length === 0) return null;

    return (
        <Card className="border-border/50 bg-muted/20">
            <CardHeader>
                <CardTitle className="text-lg">Ủng hộ gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {supporters.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <Avatar className="h-10 w-10 border border-background">
                            <AvatarImage src={item.supporter?.image || ""} />
                            <AvatarFallback>{item.supporter?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">
                                    {item.supporter?.name || "Người ẩn danh"}
                                </p>
                                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 font-normal">
                                    {item.actionCard ? item.actionCard.title : "Ủng hộ"}
                                </Badge>
                                <span className="text-primary font-bold text-sm">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                            {item.message && (
                                <p className="text-sm text-foreground/80 bg-background/50 p-2 rounded-md italic">
                                    "{item.message}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function PostPreviewList({ posts, creatorUsername }: { posts: any[], creatorUsername: string }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Bài viết mới nhất</h3>
                <Button variant="link" asChild className="text-primary">
                    <Link href={`/c/${creatorUsername}/posts`}>Xem tất cả</Link>
                </Button>
            </div>
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className="hover:border-primary/40 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg leading-tight line-clamp-2">
                                    {post.title}
                                </CardTitle>
                                {post.visibility === 'MEMBERS' && (
                                    <Badge variant="outline" className="ml-2 gap-1 text-muted-foreground">
                                        <Lock className="h-3 w-3" /> Members
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.content}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-0 justify-end">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/c/${creatorUsername}/posts/${post.id}`}>
                                    Đọc tiếp <MessageSquare className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function GalleryPreviewGrid({ items, creatorUsername }: { items: any[], creatorUsername: string }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Thư viện</h3>
                <Button variant="link" asChild className="text-primary">
                    <Link href={`/c/${creatorUsername}/gallery`}>Xem tất cả</Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/c/${creatorUsername}/gallery`}
                        className="group relative aspect-square bg-muted rounded-xl overflow-hidden block border border-border/50"
                    >
                        {/* Placeholder for real image since seed uses url string */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${item.url})` }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                        <div className="absolute top-2 right-2">
                            {item.visibility === 'MEMBERS' && (
                                <div className="bg-black/50 p-1.5 rounded-full backdrop-blur-sm text-white">
                                    <Lock className="h-3 w-3" />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-medium truncate">{item.title}</p>
                            <div className="flex items-center gap-1 text-[10px] text-white/80">
                                {item.type === 'VIDEO' ? <PlayCircle className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                {item.type}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function MembershipTeaser({ tiers, creatorUsername }: { tiers: any[], creatorUsername: string }) {
    if (!tiers || tiers.length === 0) return null;

    return (
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Trở thành Member</h3>
                    <p className="text-muted-foreground">Nhận quyền lợi đặc biệt và nội dung độc quyền.</p>
                </div>
                <Button size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20" asChild>
                    <Link href={`/c/${creatorUsername}/membership`}>
                        Xem các gói Membership
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {tiers.slice(0, 2).map(tier => (
                    <div key={tier.id} className="bg-background/80 backdrop-blur rounded-xl p-4 border border-border/50">
                        <div className="flex justify-between items-baseline mb-2">
                            <h4 className="font-bold">{tier.title}</h4>
                            <span className="text-primary font-bold">{formatCurrency(tier.priceMonthlyCents)}/tháng</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                            {JSON.parse(tier.perks || '[]').slice(0, 2).map((perk: string, i: number) => (
                                <li key={i}>{perk}</li>
                            ))}
                            {(JSON.parse(tier.perks || '[]').length > 2) && <li>...và hơn thế nữa</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
