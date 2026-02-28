import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Public Piped API instances (fallback chain for reliability)
const PIPED_INSTANCES = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.adminforge.de",
    "https://piped-api.garudalinux.org",
    "https://api.piped.yt",
];

function extractVideoId(url: string): string | null {
    try {
        const u = new URL(url.includes("://") ? url : `https://${url}`);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
        return u.searchParams.get("v");
    } catch {
        return null;
    }
}

async function fetchPipedStreams(videoId: string): Promise<any> {
    let lastErr: Error = new Error("All Piped instances failed");
    for (const instance of PIPED_INSTANCES) {
        try {
            const res = await fetch(`${instance}/streams/${videoId}`, {
                signal: AbortSignal.timeout(12000),
                headers: { Accept: "application/json" },
            });
            if (!res.ok) continue;
            const data = await res.json();
            if (data.error) continue;
            return data;
        } catch (e: any) {
            lastErr = e;
        }
    }
    throw lastErr;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ error: "Could not extract video ID" }, { status: 400 });

    try {
        const data = await fetchPipedStreams(videoId);

        // ─── Video formats (combined video+audio only) ────────────────
        const videoFormats = ((data.videoStreams as any[]) || [])
            .filter((s) => !s.videoOnly && s.quality)
            .map((s) => ({
                itag: 0,
                quality: s.quality as string,
                mime: s.mimeType?.split(";")[0] ?? "video/mp4",
                hasVideo: true,
                hasAudio: true,
            }))
            .filter((v, i, a) => a.findIndex((t) => t.quality === v.quality) === i);

        // ─── Audio formats ────────────────────────────────────────────
        const audioFormats = ((data.audioStreams as any[]) || [])
            .map((s) => {
                const bitrate = Math.round((s.bitrate ?? s.audioBitrate ?? 0) / 1000);
                return {
                    itag: 0,
                    quality: `${bitrate || "?"}kbps`,
                    mime: s.mimeType?.split(";")[0] ?? "audio/mpeg",
                    hasVideo: false,
                    hasAudio: true,
                    bitrate,
                };
            })
            .sort((a, b) => b.bitrate - a.bitrate)
            .filter((v, i, a) => a.findIndex((t) => t.quality === v.quality) === i)
            .slice(0, 3);

        return NextResponse.json({
            id: videoId,
            title: data.title ?? "",
            tags: data.tags ?? [],
            thumbnail: data.thumbnailUrl ?? "",
            formats: { video: videoFormats, audio: audioFormats },
        });
    } catch (error: any) {
        console.error("YouTube parse error:", error.message);
        return NextResponse.json({ error: "Failed to parse YouTube video" }, { status: 500 });
    }
}
