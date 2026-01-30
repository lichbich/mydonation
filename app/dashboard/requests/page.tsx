import { getDashboardRequests } from "@/lib/actions/dashboard/requests";
import { RequestsManager } from "@/components/dashboard/requests-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Yêu cầu - Dashboard",
};

export default async function RequestsPage() {
    const data = await getDashboardRequests();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yêu Cầu (Requests)</h1>
                <p className="text-muted-foreground">Quản lý các đơn đặt hàng và yêu cầu từ Fan.</p>
            </div>

            <RequestsManager initialData={data} />
        </div>
    );
}
