import { NextResponse } from "next/server";
import play from "play-dl";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Detect if a format is combined (video+audio) by checking if mimeType
 * has two codecs separated by a comma.
 * e.g. 'video/mp4; codecs="avc1.42001E, mp4a.40.2"' → combined ✅
 *      'video/mp4; codecs="avc1.640028"'              → video-only ❌
 */
function isCombinedFormat(mimeType: string): boolean {
    const codecs = mimeType.match(/codecs="([^"]+)"/)?.[1] ?? "";
    return codecs.includes(",");
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    try {
        const info = await play.video_info(url);
        const details = info.video_details;
        const formats = (info.format as any[]) || [];

        const thumbnail = details.thumbnails?.at(-1)?.url ?? "";

        // ─── Video formats ───────────────────────────────────────────
        // Detect by qualityLabel, differentiate combined vs video-only via codec count
        const videoFormats = formats
            .filter((f) => f.qualityLabel && f.mimeType?.includes("video"))
            .map((f) => ({
                itag: f.itag,
                quality: f.qualityLabel as string,
                mime: f.mimeType?.split(";")[0] ?? "video/mp4",
                hasVideo: true,
                hasAudio: isCombinedFormat(f.mimeType ?? ""),
                hasUrl: !!f.url,
            }))
            // Only show formats with a direct URL (downloadable without ffmpeg merge)
            .filter((f) => f.hasAudio && f.hasUrl)
            // Deduplicate by quality label
            .filter((v, i, a) => a.findIndex((t) => t.quality === v.quality) === i);

        // ─── Audio-only formats ───────────────────────────────────────
        // Detect by: mimeType includes "audio" AND no qualityLabel
        const audioFormats = formats
            .filter((f) => !f.qualityLabel && f.mimeType?.includes("audio"))
            .map((f) => {
                // Infer quality label from known itag mapping
                const bitrateMap: Record<number, string> = {
                    139: "48kbps", 140: "128kbps", 141: "256kbps",
                    249: "50kbps", 250: "70kbps", 251: "160kbps",
                    171: "128kbps", 172: "256kbps",
                };
                const qualityLabel = bitrateMap[f.itag] ?? "audio";
                const bitrateNum = parseInt(qualityLabel) || 0;
                return {
                    itag: f.itag,
                    quality: qualityLabel,
                    mime: f.mimeType?.split(";")[0] ?? "audio/webm",
                    hasVideo: false,
                    hasAudio: true,
                    bitrate: bitrateNum,
                };
            })
            .sort((a, b) => b.bitrate - a.bitrate)
            .filter((v, i, a) => a.findIndex((t) => t.quality === v.quality) === i)
            .slice(0, 3);

        return NextResponse.json({
            id: details.id,
            title: details.title,
            tags: (details as any).keywords || [],
            thumbnail,
            formats: {
                video: videoFormats,
                audio: audioFormats,
            },
        });
    } catch (error: any) {
        console.error("YouTube parse error:", error);
        return NextResponse.json({ error: "Failed to parse YouTube video" }, { status: 500 });
    }
}
