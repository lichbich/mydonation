import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased relative">
            {/* Ambient Background Glow (Optional aesthetics) */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-background" >
                <div className="absolute h-full w-full bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
            </div>

            <SiteHeader />
            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
