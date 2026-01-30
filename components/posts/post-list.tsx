"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Post {
    id: string;
    title: string;
    excerpt: string;
    visibility: string;
    createdAt: Date;
}

interface PostListTabsProps {
    posts: Post[];
    username: string;
}

export function PostListTabs({ posts, username }: PostListTabsProps) {
    const publicPosts = posts.filter(p => p.visibility === 'PUBLIC');
    const memberPosts = posts.filter(p => p.visibility === 'MEMBERS');

    return (
        <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                <TabsTrigger value="public">Công khai ({publicPosts.length})</TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Dành cho Members ({memberPosts.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="public" className="space-y-4">
                {publicPosts.length > 0 ? (
                    <PostGrid posts={publicPosts} username={username} />
                ) : (
                    <EmptyState type="public" />
                )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
                {memberPosts.length > 0 ? (
                    <PostGrid posts={memberPosts} username={username} />
                ) : (
                    <EmptyState type="members" />
                )}
            </TabsContent>
        </Tabs>
    );
}

function PostGrid({ posts, username }: { posts: Post[], username: string }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {posts.map(post => (
                <Link key={post.id} href={`/c/${username}/posts/${post.id}`} className="block group">
                    <Card className="hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {post.title}
                                </CardTitle>
                                {post.visibility === 'MEMBERS' && (
                                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 whitespace-nowrap">
                                        <Lock className="h-3 w-3 mr-1" /> Premium
                                    </Badge>
                                )}
                            </div>
                            <CardDescription>
                                <span suppressHydrationWarning>
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-3">
                                {post.excerpt || "Không có nội dung tóm tắt."}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="link" className="p-0 h-auto font-semibold text-primary">
                                Đọc tiếp &rarr;
                            </Button>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

function EmptyState({ type }: { type: 'public' | 'members' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/30">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                {type === 'members' ? <Lock className="h-6 w-6 text-muted-foreground" /> : <FileText className="h-6 w-6 text-muted-foreground" />}
            </div>
            <h3 className="font-semibold text-lg">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground max-w-sm">
                {type === 'members'
                    ? "Creator chưa đăng nội dung độc quyền nào."
                    : "Creator chưa đăng bài viết công khai nào."}
            </p>
        </div>
    )
}
