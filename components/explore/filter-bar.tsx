"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X } from "lucide-react";
// import { useDebounce } from "@/lib/hooks/use-debounce"; 

// Simple inline debounce hook if file doesn't exist
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Local state for immediate UI feedback
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [hasMembership, setHasMembership] = useState(searchParams.get("hasMembership") === "true");
    const [hasFeatured, setHasFeatured] = useState(searchParams.get("hasFeatured") === "true");

    const debouncedSearch = useDebounceValue(search, 500);

    // Update Params Logic
    const updateParams = useCallback((newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        startTransition(() => {
            router.push(`/explore?${params.toString()}`);
        });
    }, [searchParams, router]);

    // Effects
    useEffect(() => {
        const currentQ = searchParams.get("q") || "";
        if (debouncedSearch !== currentQ) {
            updateParams({ q: debouncedSearch || null });
        }
    }, [debouncedSearch, updateParams, searchParams]);

    const handleSortChange = (val: string) => {
        setSort(val);
        updateParams({ sort: val });
    };

    const handleMembershipChange = (checked: boolean) => {
        setHasMembership(checked);
        updateParams({ hasMembership: checked ? "true" : null });
    };

    const handleFeaturedChange = (checked: boolean) => {
        setHasFeatured(checked);
        updateParams({ hasFeatured: checked ? "true" : null });
    };

    const clearFilters = () => {
        setSearch("");
        setSort("newest");
        setHasMembership(false);
        setHasFeatured(false);
        router.push("/explore");
    };

    const hasActiveFilters = !!search || sort !== "newest" || hasMembership || hasFeatured;

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm Creator theo tên, username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-12"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={sort} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full md:w-[180px] h-12">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="popular">Phổ biến nhất</SelectItem>
                            <SelectItem value="trending">Xu hướng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <Switch id="membership" checked={hasMembership} onCheckedChange={handleMembershipChange} />
                        <Label htmlFor="membership" className="cursor-pointer">Có Membership</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="featured" checked={hasFeatured} onCheckedChange={handleFeaturedChange} />
                        <Label htmlFor="featured" className="cursor-pointer">Có Action Nổi Bật</Label>
                    </div>
                </div>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                        <X className="mr-2 h-4 w-4" />
                        Xóa bộ lọc
                    </Button>
                )}
            </div>

            {isPending && (
                <div className="h-1 w-full bg-primary/20 overflow-hidden rounded-full">
                    <div className="h-full bg-primary w-1/3 animate-indeterminate-bar" />
                </div>
            )}
        </div>
    );
}

// Add CSS animation for loader somewhere global ideally, but ok for now
