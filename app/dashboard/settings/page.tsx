"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, User, Bell, Shield, CreditCard } from "lucide-react";

export default function DashboardSettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // TODO: Implement save
        setTimeout(() => {
            toast.success("Đã lưu thay đổi");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Cài Đặt</h1>
                <p className="text-muted-foreground">
                    Quản lý thông tin tài khoản và tùy chọn
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Hồ Sơ
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Thông Báo
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Bảo Mật
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Thanh Toán
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Cá Nhân</CardTitle>
                            <CardDescription>
                                Cập nhật thông tin hiển thị trên trang của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={session?.user?.image || ""} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-2xl">
                                        {session?.user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline" size="sm">
                                        Đổi Avatar
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPG, PNG. Max 2MB
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Họ và tên</Label>
                                    <Input
                                        id="name"
                                        defaultValue={session?.user?.name || ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        defaultValue={(session?.user as any)?.username || ""}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={session?.user?.email || ""}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề Creator</Label>
                                <Input
                                    id="title"
                                    placeholder="VD: Game Streamer, Music Producer..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Giới thiệu</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Viết vài dòng về bản thân..."
                                    rows={4}
                                />
                            </div>

                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Lưu Thay Đổi
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài Đặt Thông Báo</CardTitle>
                            <CardDescription>
                                Quản lý các thông báo bạn muốn nhận
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Tính năng đang được phát triển...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bảo Mật</CardTitle>
                            <CardDescription>
                                Quản lý mật khẩu và bảo mật tài khoản
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Tính năng đang được phát triển...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Thanh Toán</CardTitle>
                            <CardDescription>
                                Cài đặt phương thức nhận tiền
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Tính năng đang được phát triển...
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
