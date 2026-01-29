"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DonationCard, DonationCardSkeleton } from "@/components/cards/donation-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionCardSchema, ActionCardInput } from "@/lib/validations";
import { createActionCard, deleteActionCard, toggleActionCard } from "@/lib/actions/action-cards";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
    Heart,
    Users,
    TrendingUp,
    CreditCard,
    Plus,
    ExternalLink,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    LayoutDashboard,
} from "lucide-react";

interface Props {
    profile: any;
    actionCards: any[];
    donations: any[];
    stats: {
        totalDonations: number;
        totalAmount: number;
        supporterCount: number;
        activeCards: number;
    };
}

const EMOJI_OPTIONS = ["☕", "🎬", "🎥", "⭐", "🧋", "🎙️", "💜", "⚡", "🎮", "☁️", "🍕", "🎨", "📚", "🚀", "💡"];
const COLOR_OPTIONS = ["#FF5E5B", "#8B4513", "#4A90D9", "#FFD700", "#9B59B6", "#E91E63", "#00FF00", "#7C3AED", "#3B82F6", "#F59E0B"];

export function DashboardClient({ profile, actionCards, donations, stats }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const form = useForm<ActionCardInput>({
        resolver: zodResolver(actionCardSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 25000,
            emoji: "☕",
            color: "#FF5E5B",
        },
    });

    const handleCreate = async (data: ActionCardInput) => {
        setIsLoading(true);
        try {
            const result = await createActionCard(data);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Đã tạo Action Card!");
                setIsCreateOpen(false);
                form.reset();
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa Action Card này?")) return;

        setDeletingId(id);
        try {
            const result = await deleteActionCard(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Đã xóa Action Card!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggle = async (id: string) => {
        setTogglingId(id);
        try {
            const result = await toggleActionCard(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Đã cập nhật trạng thái!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setTogglingId(null);
        }
    };

    const selectedEmoji = form.watch("emoji");
    const selectedColor = form.watch("color");

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <LayoutDashboard className="h-8 w-8 text-primary" />
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Chào mừng, <span className="font-medium">{profile.name}</span>!
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/${profile.username}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Xem Trang Cá Nhân
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalDonations}</p>
                                    <p className="text-sm text-muted-foreground">Donations</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                                    <p className="text-sm text-muted-foreground">Tổng Thu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-pink-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.supporterCount}</p>
                                    <p className="text-sm text-muted-foreground">Supporters</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <CreditCard className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.activeCards}</p>
                                    <p className="text-sm text-muted-foreground">Active Cards</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Action Cards */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Action Cards</CardTitle>
                                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tạo Mới
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Tạo Action Card Mới</DialogTitle>
                                            <DialogDescription>
                                                Tạo một Action Card để nhận ủng hộ từ supporters
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                                                {/* Preview */}
                                                <div
                                                    className="p-4 rounded-lg border text-center"
                                                    style={{ backgroundColor: `${selectedColor}10` }}
                                                >
                                                    <span className="text-4xl">{selectedEmoji}</span>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tiêu đề</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="VD: Mua Cà Phê" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mô tả</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="VD: Giúp mình tỉnh táo để làm video chất lượng hơn!"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Giá (VND)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={1000}
                                                                    step={1000}
                                                                    value={field.value}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="emoji"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Emoji</FormLabel>
                                                            <FormControl>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {EMOJI_OPTIONS.map((emoji) => (
                                                                        <button
                                                                            key={emoji}
                                                                            type="button"
                                                                            className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${field.value === emoji
                                                                                ? "ring-2 ring-primary bg-primary/20"
                                                                                : "bg-muted hover:bg-muted/80"
                                                                                }`}
                                                                            onClick={() => field.onChange(emoji)}
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="color"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Màu sắc</FormLabel>
                                                            <FormControl>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {COLOR_OPTIONS.map((color) => (
                                                                        <button
                                                                            key={color}
                                                                            type="button"
                                                                            className={`w-8 h-8 rounded-full transition-all ${field.value === color
                                                                                ? "ring-2 ring-offset-2 ring-primary"
                                                                                : ""
                                                                                }`}
                                                                            style={{ backgroundColor: color }}
                                                                            onClick={() => field.onChange(color)}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        "Tạo Action Card"
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                {actionCards.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                        <div className="text-4xl mb-4">📝</div>
                                        <p className="text-muted-foreground mb-4">
                                            Bạn chưa có Action Card nào
                                        </p>
                                        <Button onClick={() => setIsCreateOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tạo Card Đầu Tiên
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {actionCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className={`p-4 rounded-lg border flex items-center gap-4 ${!card.isActive ? "opacity-60" : ""
                                                    }`}
                                                style={{ backgroundColor: `${card.color}10` }}
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                                                    style={{ backgroundColor: `${card.color}20` }}
                                                >
                                                    {card.emoji}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium truncate">{card.title}</h3>
                                                        {!card.isActive && (
                                                            <Badge variant="secondary">Ẩn</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {card.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-sm">
                                                        <span style={{ color: card.color }} className="font-medium">
                                                            {formatCurrency(card.price)}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {card._count?.donations || 0} lượt ủng hộ
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggle(card.id)}
                                                        disabled={togglingId === card.id}
                                                    >
                                                        {togglingId === card.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : card.isActive ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(card.id)}
                                                        disabled={deletingId === card.id}
                                                    >
                                                        {deletingId === card.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Donations */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ủng Hộ Gần Đây</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {donations.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                        <div className="text-4xl mb-4">💝</div>
                                        <p className="text-muted-foreground text-sm">
                                            Chưa có donation nào
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[400px] pr-4">
                                        <div className="space-y-3">
                                            {donations.slice(0, 10).map((donation) => (
                                                <DonationCard key={donation.id} donation={donation} />
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
