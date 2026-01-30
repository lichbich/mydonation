import { getDashboardPosts } from "@/lib/actions/dashboard/posts";
import { PostsManager } from "@/components/dashboard/posts-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Bài viết - Dashboard",
};

export default async function PostsPage() {
    const data = await getDashboardPosts();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bài Viết</h1>
                <p className="text-muted-foreground">Chia sẻ nội dung độc quyền hoặc thông báo mới nhất đến cộng đồng.</p>
            </div>

            <PostsManager initialData={data} />
        </div>
    );
}
