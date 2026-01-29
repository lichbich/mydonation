import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const metadata = {
    title: "Bài Viết",
};

export default function CreatorPostsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bài Viết</h2>

            {/* Empty State */}
            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Chưa có bài viết</h3>
                    <p className="text-muted-foreground">
                        Creator chưa đăng bài viết nào
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
