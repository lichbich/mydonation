import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Wallet, HeartHandshake } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "1. Tạo Hồ Sơ",
        description: "Đăng ký tài khoản Creator, thiết lập profile cá nhân hóa và kết nối các mạng xã hội của bạn.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Wallet,
        title: "2. Tạo Action Cards",
        description: "Tạo các menu ủng hộ độc đáo: 'Mời cafe', 'Yêu cầu fanign', 'Q&A ưu tiên'... với mức giá bạn muốn.",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
    },
    {
        icon: HeartHandshake,
        title: "3. Nhận Ủng Hộ",
        description: "Chia sẻ link profile cho Fan. Nhận tiền ủng hộ trực tiếp vào tài khoản và thực hiện các yêu cầu.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export function HowItWorksSection() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Cách Thức Hoạt Động</h2>
                    <p className="text-muted-foreground text-lg">
                        Bắt đầu hành trình sáng tạo và kiếm thu nhập chỉ trong 3 bước đơn giản.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <Card key={index} className="border-border/50 bg-background/50 backdrop-blur-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                    <step.icon className={`h-7 w-7 ${step.color}`} />
                                </div>
                                <CardTitle className="text-xl">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
