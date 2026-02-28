import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url || !url.includes("tiktok.com")) {
        return NextResponse.json({ error: "Invalid TikTok URL" }, { status: 400 });
    }

    try {
        console.log("Fetching Tiktok info for: ", url);
        // Try to fetch tikwm backend proxy
        try {
            const tikwmResponse = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "application/json"
                }
            });
            const tikwmData = await tikwmResponse.json();

            if (tikwmData.code === 0 && tikwmData.data) {
                return NextResponse.json({
                    id: tikwmData.data.id || "tiktok_id",
                    title: tikwmData.data.title || "Video TikTok",
                    author: tikwmData.data.author?.unique_id || "tiktok_creator",
                    thumbnail: tikwmData.data.cover || "",
                    views: tikwmData.data.play_count ? ("" + tikwmData.data.play_count) : "N/A",
                    likes: tikwmData.data.digg_count ? ("" + tikwmData.data.digg_count) : "N/A",
                    playUrl: tikwmData.data.play || "",
                    wmplayUrl: tikwmData.data.wmplay || "",
                    musicUrl: tikwmData.data.music || "",
                    source: "tikwm"
                });
            }
        } catch (e) {
            console.error("tikwm failed", e);
        }

        // Fallback to basic scraping for recognizer functionality
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        let title = $('meta[property="og:title"]').attr("content") || "Video TikTok Unknown";
        const thumbnail = $('meta[property="og:image"]').attr("content") || "";
        const description = $('meta[property="og:description"]').attr("content") || title;

        // Sometimes title is appended with " | TikTok", let's format it nicer
        if (title.includes(" | TikTok")) {
            title = title.split(" | TikTok")[0];
        }

        // Extract username from url
        const authorMatch = url.match(/@([a-zA-Z0-9_.-]+)/);
        const author = authorMatch ? authorMatch[1] : "creator";

        return NextResponse.json({
            id: url,
            title: description, // Use description since TikTok titles are often short
            author,
            thumbnail,
            views: "N/A",
            likes: "N/A",
            source: "scraper"
        });
    } catch (error: any) {
        console.error("TikTok parse error:", error);
        return NextResponse.json({ error: "Failed to parse TikTok video" }, { status: 500 });
    }
}
