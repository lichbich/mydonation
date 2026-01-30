"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile, updateCreatorProfile } from "@/lib/actions/dashboard/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, User, Palette, Link as LinkIcon, Facebook, Youtube, Instagram, Twitter, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    bio: z.string().max(500).optional().nullable(),
    image: z.string().url("URL không hợp lệ").optional().nullable().or(z.literal("")),
});

const creatorSchema = z.object({
    headline: z.string().max(200).optional().nullable().or(z.literal("")),
    coverImage: z.string().url("URL không hợp lệ").optional().nullable().or(z.literal("")),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    facebook: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
});

interface SettingsFormProps {
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        image: string | null;
        bio: string | null;
        role: string;
        creatorProfile: {
            headline: string | null;
            coverImage: string | null;
            accentColor: string;
            socialLinks: {
                facebook?: string;
                youtube?: string;
                instagram?: string;
                twitter?: string;
                website?: string;
            };
        } | null;
    };
}

export function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingCreator, setIsLoadingCreator] = useState(false);

    // Profile Form
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            bio: user.bio || "",
            image: user.image || "",
        },
    });

    // Creator Form
    const creatorForm = useForm<z.infer<typeof creatorSchema>>({
        resolver: zodResolver(creatorSchema),
        defaultValues: {
            headline: user.creatorProfile?.headline || "",
            coverImage: user.creatorProfile?.coverImage || "",
            accentColor: user.creatorProfile?.accentColor || "#3b82f6",
            facebook: user.creatorProfile?.socialLinks?.facebook || "",
            youtube: user.creatorProfile?.socialLinks?.youtube || "",
            instagram: user.creatorProfile?.socialLinks?.instagram || "",
            twitter: user.creatorProfile?.socialLinks?.twitter || "",
            website: user.creatorProfile?.socialLinks?.website || "",
        },
    });

    // Submit Profile
    async function onSubmitProfile(values: z.infer<typeof profileSchema>) {
        setIsLoadingProfile(true);
        const res = await updateProfile(values);
        setIsLoadingProfile(false);

        if (res.success) {
            toast.success("Đã cập nhật hồ sơ!");
            router.refresh();
        } else {
            toast.error(res.error || "Lỗi cập nhật");
        }
    }

    // Submit Creator Profile
    async function onSubmitCreator(values: z.infer<typeof creatorSchema>) {
        setIsLoadingCreator(true);
        const res = await updateCreatorProfile({
            headline: values.headline,
            coverImage: values.coverImage,
            accentColor: values.accentColor,
            socialLinks: {
                facebook: values.facebook,
                youtube: values.youtube,
                instagram: values.instagram,
                twitter: values.twitter,
                website: values.website,
            },
        });
        setIsLoadingCreator(false);

        if (res.success) {
            toast.success("Đã cập nhật hồ sơ Creator!");
            router.refresh();
        } else {
            toast.error(res.error || "Lỗi cập nhật");
        }
    }

    return (
        <div className="space-y-8">
            {/* Basic Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông Tin Cá Nhân
                    </CardTitle>
                    <CardDescription>Thông tin cơ bản hiển thị trên hồ sơ của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                            {/* Avatar Preview */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={profileForm.watch("image") || user.image || ""} />
                                    <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <FormField
                                        control={profileForm.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL Ảnh Đại Diện</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/avatar.jpg" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormDescription>Nhập URL ảnh từ bất kỳ nguồn nào</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={profileForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên Hiển Thị</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tên của bạn" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <FormLabel>Username</FormLabel>
                                    <Input value={`@${user.username}`} disabled className="mt-2 bg-muted" />
                                    <p className="text-xs text-muted-foreground mt-1">Username không thể thay đổi</p>
                                </div>
                            </div>

                            <FormField
                                control={profileForm.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giới Thiệu Bản Thân</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Viết đôi dòng về bản thân bạn..."
                                                rows={4}
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>{(field.value?.length || 0)}/500 ký tự</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isLoadingProfile}>
                                {isLoadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Lưu Thay Đổi
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Creator Profile Section */}
            {user.role === "CREATOR" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Trang Creator
                        </CardTitle>
                        <CardDescription>Tùy chỉnh trang cá nhân Creator của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...creatorForm}>
                            <form onSubmit={creatorForm.handleSubmit(onSubmitCreator)} className="space-y-6">
                                <FormField
                                    control={creatorForm.control}
                                    name="headline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Headline / Slogan</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ví dụ: Gaming Streamer & Content Creator" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormDescription>Mô tả ngắn gọn về bạn</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={creatorForm.control}
                                        name="coverImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL Ảnh Bìa</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/cover.jpg" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormDescription>Ảnh nền trang cá nhân (1200x400px)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={creatorForm.control}
                                        name="accentColor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Màu Chủ Đạo</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input type="color" className="w-16 h-10 p-1 cursor-pointer" {...field} />
                                                    </FormControl>
                                                    <Input value={field.value} onChange={field.onChange} className="flex-1 font-mono" />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Cover Preview */}
                                {creatorForm.watch("coverImage") && (
                                    <div className="rounded-xl overflow-hidden border border-border h-32 bg-cover bg-center" style={{ backgroundImage: `url(${creatorForm.watch("coverImage")})` }}>
                                        <div className="h-full w-full bg-black/30 flex items-center justify-center">
                                            <span className="text-white/80 text-sm">Preview Ảnh Bìa</span>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* Social Links */}
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 mb-4">
                                        <LinkIcon className="h-4 w-4" />
                                        Liên Kết Mạng Xã Hội
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={creatorForm.control}
                                            name="facebook"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://facebook.com/username" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={creatorForm.control}
                                            name="youtube"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Youtube className="h-4 w-4 text-[#FF0000]" /> YouTube
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://youtube.com/@channel" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={creatorForm.control}
                                            name="instagram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Instagram className="h-4 w-4 text-[#E4405F]" /> Instagram
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://instagram.com/username" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={creatorForm.control}
                                            name="twitter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Twitter/X
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://twitter.com/username" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={creatorForm.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" /> Website
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://yourwebsite.com" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={isLoadingCreator}>
                                    {isLoadingCreator && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" />
                                    Lưu Cài Đặt Creator
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {/* Account Info (Read Only) */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông Tin Tài Khoản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="font-mono bg-muted px-3 py-2 rounded-md mt-1">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Loại Tài Khoản</label>
                            <p className="font-semibold mt-1">{user.role === "CREATOR" ? "🎨 Creator" : "💖 Fan"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
