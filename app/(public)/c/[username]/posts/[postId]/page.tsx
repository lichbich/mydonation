import { getPostDetail } from "@/lib/actions/posts";
import { MarkdownRenderer } from "@/components/posts/markdown-renderer";
import { Paywall } from "@/components/posts/paywall";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Lock, Unlock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateMetadata({ params }: { params: Promise<{ username: string; postId: string }> }) {
    const { username, postId } = await params;
    const post = await getPostDetail(username, postId);
    if (!post) return { title: 'Post Not Found' };
    return { title: `${post.title} - ${post.creator.name} (@${post.creator.username})` };
}

export default async function PostDetailPage({ params }: { params: Promise<{ username: string; postId: string }> }) {
    const { username, postId } = await params;
    const post = await getPostDetail(username, postId);

    if (!post) notFound();

    return (
        <div className="container py-12 px-4 max-w-3xl mx-auto min-h-screen">
            <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                <Link href={`/c/${username}/posts`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Link>
            </Button>

            <article>
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md" suppressHydrationWarning>
                            <CalendarDays className="h-3 w-3" />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                        </span>
                        {post.visibility === 'MEMBERS' && (
                            <span className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md font-medium">
                                {post.hasAccess ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                Members Only
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                        <Avatar className="h-10 w-10 border border-background">
                            <AvatarImage src={post.creator.image || ""} />
                            <AvatarFallback>{post.creator.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">
                                <Link href={`/c/${username}`} className="hover:underline">{post.creator.name}</Link>
                            </p>
                            <p className="text-xs text-muted-foreground">@{post.creator.username}</p>
                        </div>
                    </div>
                </header>

                <div className="min-h-[300px]">
                    {post.hasAccess ? (
                        <MarkdownRenderer content={post.content || ""} />
                    ) : (
                        <div className="space-y-6">
                            {/* Teaser content (blurry) if we had it, but here just show some fake lines or nothing */}
                            <div className="space-y-4 blur-sm select-none opacity-50 pointer-events-none" aria-hidden="true">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                            </div>

                            <Paywall
                                tier={post.lowestTier}
                                creatorName={post.creator.name || username}
                                creatorUsername={username}
                            />
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
