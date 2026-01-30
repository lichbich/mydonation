import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
    {
        content: "MyDonation giúp tôi dễ dàng nhận sự ủng hộ từ fan mà không cần setup phức tạp. Giao diện cực kỳ đẹp và chuyên nghiệp.",
        author: "Dũng CT",
        role: "Streamer",
        image: "https://ui-avatars.com/api/?name=Dung+CT&background=0D8ABC&color=fff"
    },
    {
        content: "Tính năng Action Cards thật sự sáng tạo. Fan của tôi rất thích khi họ có thể request vẽ tranh trực tiếp qua nền tảng.",
        author: "Minh Họa",
        role: "Digital Artist",
        image: "https://ui-avatars.com/api/?name=Minh+Hoa&background=db2777&color=fff"
    },
    {
        content: "Là một fan, tôi thấy việc donate trở nên vui hơn nhiều. Cảm giác được tương tác thật sự với Idol chứ không chỉ là chuyển khoản.",
        author: "Fan Boy 99",
        role: "Supporter",
        image: "https://ui-avatars.com/api/?name=Fan+Boy&background=random"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-muted/20">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Mọi Người Nói Gì?</h2>
                    <p className="text-muted-foreground">Được tin dùng bởi cộng đồng Creator và Fan nhiệt huyết.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <Card key={index} className="border-none shadow-none bg-transparent">
                            <CardContent className="pt-6 relative">
                                <Quote className="absolute top-0 left-0 h-8 w-8 text-primary/10 rotate-180" />
                                <p className="text-lg italic text-muted-foreground mb-6 relative z-10 pl-6">
                                    "{item.content}"
                                </p>
                                <div className="flex items-center gap-4 pl-6">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={item.image} alt={item.author} />
                                        <AvatarFallback>{item.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm">{item.author}</p>
                                        <p className="text-xs text-muted-foreground">{item.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
