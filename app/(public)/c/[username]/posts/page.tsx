import { getCreatorPosts } from "@/lib/actions/posts";
import { PostListTabs } from "@/components/posts/post-list";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function CreatorPostsPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const data = await getCreatorPosts(username);

    if (!data) notFound();

    return (
        <div className="container py-12 px-4 max-w-4xl mx-auto min-h-screen">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/c/${username}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Bài Viết</h1>
                    <p className="text-muted-foreground">Cập nhật mới nhất từ {username}</p>
                </div>
            </div>

            <PostListTabs posts={data.posts} username={username} />
        </div>
    );
}
