import Link from "next/link";
import { getFeaturedCreators } from "@/lib/actions/creators";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Search, Compass } from "lucide-react";

export const metadata = {
    title: "Khám Phá Creators",
    description: "Tìm kiếm và ủng hộ creators yêu thích của bạn",
};

export default async function ExplorePage() {
    const creators = await getFeaturedCreators(12);

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <Compass className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Khám Phá Creators
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        Tìm kiếm những creators tuyệt vời và ủng hộ họ theo cách của bạn
                    </p>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm creators..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Grid */}
                {creators.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold mb-2">Chưa có creators</h2>
                        <p className="text-muted-foreground">
                            Hãy quay lại sau nhé!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {creators.map((creator: any) => (
                            <Link key={creator.id} href={`/c/${creator.username}`}>
                                <Card className="group hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                                    <div className="h-28 bg-gradient-to-br from-primary/50 via-pink-500/50 to-purple-500/50" />
                                    <CardContent className="pt-0 pb-6 -mt-10 relative">
                                        <Avatar className="h-20 w-20 ring-4 ring-background mb-3">
                                            <AvatarImage src={creator.image || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-2xl">
                                                {creator.name?.charAt(0) || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                            {creator.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            @{creator.username}
                                        </p>
                                        {creator.creatorTitle && (
                                            <Badge variant="secondary" className="mb-3">
                                                {creator.creatorTitle}
                                            </Badge>
                                        )}
                                        {creator.creatorBio && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {creator.creatorBio}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Heart className="h-3 w-3" />
                                                {creator._count?.received || 0}
                                            </span>
                                            <span>{creator.actionCards?.length || 0} cards</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
