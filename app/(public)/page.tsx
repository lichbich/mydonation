import { Suspense } from "react";
import { getFeaturedCreators } from "@/lib/actions/creators";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { FeaturedCreatorsSection, FeaturedCreatorsSkeleton } from "@/components/home/featured-creators-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyDonation - Kết nối Creator và Fan qua những hành động ý nghĩa",
    description: "Nền tảng giúp Creator nhận ủng hộ và tương tác với Fan thông qua các Action Cards sáng tạo.",
};

async function FeaturedCreatorsLoader() {
    // Fetch data safely
    try {
        const creators = await getFeaturedCreators(6);
        return <FeaturedCreatorsSection creators={creators} />;
    } catch (error) {
        console.error("Failed to load creators:", error);
        return <div className="text-center py-12 text-muted-foreground">Không thể tải danh sách Creators lúc này.</div>;
    }
}

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />

            <HowItWorksSection />

            <Suspense fallback={<FeaturedCreatorsSkeleton />}>
                <FeaturedCreatorsLoader />
            </Suspense>

            <TestimonialsSection />

            <CTASection />
        </div>
    );
}
