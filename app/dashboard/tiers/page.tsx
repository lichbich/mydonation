import { getDashboardTiers } from "@/lib/actions/dashboard/tiers";
import { TiersManager } from "@/components/dashboard/tiers-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Membership Tiers - Dashboard",
};

export default async function TiersPage() {
    const data = await getDashboardTiers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Membership Tiers</h1>
                <p className="text-muted-foreground">Thiết lập các cấp độ thành viên và đặc quyền.</p>
            </div>

            <TiersManager initialData={data} />
        </div>
    );
}
