import { DashboardSidebar, DashboardMobileNav } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <DashboardSidebar />
            <div className="lg:pl-64">
                <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
            </div>
            <DashboardMobileNav />
        </div>
    );
}
