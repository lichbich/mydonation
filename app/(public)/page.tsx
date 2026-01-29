import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFeaturedCreators } from "@/lib/actions/creators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Sparkles,
    Zap,
    Shield,
    ArrowRight,
    Users,
    CreditCard,
    TrendingUp,
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Action Cards",
        description: "Tạo các card ủng hộ với mục tiêu cụ thể thay vì donate chung chung",
    },
    {
        icon: Users,
        title: "Membership Tiers",
        description: "Xây dựng cộng đồng với các gói membership độc quyền",
    },
    {
        icon: Zap,
        title: "Instant Payout",
        description: "Nhận tiền ngay lập tức, không phải chờ đợi",
    },
    {
        icon: Shield,
        title: "An Toàn & Bảo Mật",
        description: "Thanh toán được bảo vệ với công nghệ mã hóa tiên tiến",
    },
];

const steps = [
    { step: "01", title: "Đăng Ký", description: "Tạo tài khoản creator miễn phí" },
    { step: "02", title: "Tùy Chỉnh", description: "Thiết lập trang và Action Cards" },
    { step: "03", title: "Chia Sẻ", description: "Chia sẻ link đến cộng đồng của bạn" },
    { step: "04", title: "Nhận Tiền", description: "Nhận ủng hộ và rút tiền dễ dàng" },
];

export default async function HomePage() {
    const creators = await getFeaturedCreators(4);

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-6 px-4 py-1.5" variant="secondary">
                            <Sparkles className="mr-2 h-3 w-3" />
                            Nền tảng ủng hộ creator #1 Việt Nam
                        </Badge>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Ủng Hộ Creator
                            <br />
                            <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                Theo Cách Đặc Biệt
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Không chỉ đơn thuần là donate. Hỗ trợ creator với các Action Cards
                            độc đáo, membership tiers và nhiều hơn nữa.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg px-8" asChild>
                                <Link href="/auth/register">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Bắt Đầu Ngay
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                                <Link href="/explore">
                                    Khám Phá Creators
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-primary">10K+</p>
                                <p className="text-sm text-muted-foreground">Creators</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-pink-500">1M+</p>
                                <p className="text-sm text-muted-foreground">Supporters</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-purple-500">₫50B+</p>
                                <p className="text-sm text-muted-foreground">Raised</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 border-t border-border/40">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Tại Sao Chọn MyDonation?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Công cụ mạnh mẽ giúp creators kiếm tiền từ cộng đồng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="group hover:border-primary/50 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Bắt Đầu Chỉ Trong 4 Bước
                        </h2>
                        <p className="text-muted-foreground">
                            Đơn giản, nhanh chóng, hiệu quả
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-6xl font-bold text-primary/20 mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                                {index < steps.length - 1 && (
                                    <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground/30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Creators */}
            {creators.length > 0 && (
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                    Creators Nổi Bật
                                </h2>
                                <p className="text-muted-foreground">
                                    Khám phá và ủng hộ những creator tuyệt vời
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/explore">
                                    Xem Tất Cả
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {creators.map((creator: any) => (
                                <Link key={creator.id} href={`/c/${creator.username}`}>
                                    <Card className="group hover:border-primary/50 transition-all duration-300 overflow-hidden">
                                        <div className="h-24 bg-gradient-to-br from-primary/50 to-pink-500/50" />
                                        <CardContent className="pt-0 pb-6 -mt-8 relative">
                                            <Avatar className="h-16 w-16 ring-4 ring-background mb-3">
                                                <AvatarImage src={creator.image || ""} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-xl">
                                                    {creator.name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="font-bold group-hover:text-primary transition-colors">
                                                {creator.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                @{creator.username}
                                            </p>
                                            {creator.creatorTitle && (
                                                <Badge variant="secondary" className="mt-2">
                                                    {creator.creatorTitle}
                                                </Badge>
                                            )}
                                            <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                                                <Heart className="h-3 w-3" />
                                                <span>{creator._count?.received || 0} donations</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 bg-gradient-to-br from-primary/20 via-pink-500/20 to-purple-500/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Sẵn Sàng Bắt Đầu?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Tham gia cùng hàng ngàn creators đang kiếm thu nhập từ cộng đồng của họ
                    </p>
                    <Button size="lg" className="text-lg px-8" asChild>
                        <Link href="/auth/register">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Tạo Tài Khoản Miễn Phí
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
