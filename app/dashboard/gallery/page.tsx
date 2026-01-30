import { getDashboardGallery } from "@/lib/actions/dashboard/gallery";
import { GalleryManager } from "@/components/dashboard/gallery-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Thư viện - Dashboard",
};

export default async function GalleryPage() {
    const data = await getDashboardGallery();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Thư Viện</h1>
                <p className="text-muted-foreground">Upload và quản lý ảnh/video cho bộ sưu tập của bạn.</p>
            </div>

            <GalleryManager initialData={data} />
        </div>
    );
}
