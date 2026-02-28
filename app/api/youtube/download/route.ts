import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

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
    // format = quality label for video (e.g. "360p", "720p") or "audio"
    const format = searchParams.get("format");

    if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ error: "Could not extract video ID" }, { status: 400 });

    const isAudio = format === "audio" || format === "mp3";

    try {
        const data = await fetchPipedStreams(videoId);
        const safeTitle = (data.title ?? "download").replace(/[\/\?<>\\:\*\|":]/g, "_").trim();

        let streamUrl: string | null = null;

        if (isAudio) {
            // Highest bitrate audio stream
            const sorted = ((data.audioStreams as any[]) || []).sort(
                (a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0)
            );
            streamUrl = sorted[0]?.url ?? null;
        } else {
            // Find combined video+audio stream matching the quality label
            const videoStreams = (data.videoStreams as any[]) || [];
            const match = videoStreams.find((s) => !s.videoOnly && s.quality === format);
            // Fallback: best combined quality available
            streamUrl =
                match?.url ??
                videoStreams.filter((s) => !s.videoOnly)[0]?.url ??
                null;
        }

        if (!streamUrl) {
            return NextResponse.json({ error: "Stream URL not found" }, { status: 404 });
        }

        const ext = isAudio ? "mp3" : "mp4";
        const contentType = isAudio ? "audio/mpeg" : "video/mp4";
        const filename = encodeURIComponent(`${safeTitle}.${ext}`);

        // Proxy the Piped stream through our server
        // Piped stream URLs are NOT IP-bound (no sefc=1), so this works from any server
        const proxied = await fetch(streamUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
        });

        if (!proxied.ok || !proxied.body) {
            console.error("Piped stream fetch failed:", proxied.status, proxied.statusText);
            return NextResponse.json(
                { error: `Stream fetch failed: ${proxied.status}` },
                { status: 502 }
            );
        }

        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
        };
        const cl = proxied.headers.get("content-length");
        if (cl) headers["Content-Length"] = cl;

        return new Response(proxied.body, { headers });
    } catch (error: any) {
        console.error("Download API Error:", error.message);
        return NextResponse.json(
            { error: error.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
