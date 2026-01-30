import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/actions/dashboard/settings";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata = {
    title: "Cài Đặt Hồ Sơ",
    description: "Quản lý thông tin cá nhân và trang Creator của bạn",
};

export default async function SettingsPage() {
    const profile = await getMyProfile();

    if (!profile) {
        redirect("/auth/login");
    }

    return (
        <div className="p-6 lg:p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Cài Đặt Hồ Sơ</h1>
                <p className="text-muted-foreground">
                    Quản lý thông tin cá nhân và tùy chỉnh trang Creator của bạn
                </p>
            </div>

            <SettingsForm user={profile} />
        </div>
    );
}
