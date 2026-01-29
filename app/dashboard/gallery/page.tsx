import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image } from "lucide-react";

export const metadata = {
    title: "Thư Viện - Dashboard",
};

export default function DashboardGalleryPage() {
    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Thư Viện</h1>
                    <p className="text-muted-foreground">
                        Quản lý ảnh và video của bạn
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload
                </Button>
            </div>

            <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Thư viện trống</h3>
                    <p className="text-muted-foreground mb-4">
                        Upload ảnh/video để chia sẻ với supporters
                    </p>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload File
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
