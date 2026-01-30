import { getActionCards } from "@/lib/actions/dashboard/actions";
import { ActionsManager } from "@/components/dashboard/actions-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Action Cards - Dashboard",
};

export default async function ActionsPage() {
    const data = await getActionCards();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Action Cards</h1>
                <p className="text-muted-foreground">Tạo các gói ủng hộ để Fan có thể dễ dàng donate cho bạn.</p>
            </div>

            <ActionsManager initialData={data} />
        </div>
    );
}
