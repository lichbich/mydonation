import { NextResponse } from "next/server";
import play from "play-dl";
// @ts-ignore
import ytdl from "ytdl-core-enhanced";
import { Readable } from "stream";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function nodeStreamToWebStream(nodeStream: Readable): ReadableStream {
    return new ReadableStream({
        start(controller) {
            nodeStream.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
            nodeStream.on("end", () => controller.close());
            nodeStream.on("error", (err) => controller.error(err));
        },
        cancel() {
            nodeStream.destroy();
        },
    });
}

/**
 * play.stream() requires www.youtube.com — without it, Node.js throws ERR_INVALID_URL
 * internally inside play-dl's URL validator.
 */
function normalizeYTUrl(url: string): string {
    return url.replace(/^https?:\/\/(?!www\.)youtube\.com/, "https://www.youtube.com");
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const itagStr = searchParams.get("itag");
    const format = searchParams.get("format");

    if (!url) {
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const isAudio = format === "audio" || format === "mp3";
    const normalizedUrl = normalizeYTUrl(url);

    try {
        // Fetch metadata for filename (play-dl works everywhere)
        const info = await play.video_info(normalizedUrl);
        const safeTitle = (info.video_details.title ?? "download")
            .replace(/[\/\?<>\\:\*\|":]/g, "_")
            .trim();

        if (isAudio) {
            // ── AUDIO via play.stream() ────────────────────────────────────
            // play.stream() handles its own deciphering — does NOT use the
            // format URLs from video_info (which are sefc=1 restricted).
            // URL MUST be www.youtube.com — normalizeYTUrl() ensures this.
            const streamData = await play.stream(normalizedUrl);
            const filename = encodeURIComponent(`${safeTitle}.mp3`);

            return new Response(
                nodeStreamToWebStream(streamData.stream as unknown as Readable),
                {
                    headers: {
                        "Content-Type": "audio/mpeg",
                        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
                    },
                }
            );
        } else {
            // ── VIDEO via ytdl-core-enhanced ───────────────────────────────
            // play-dl's format URLs have sefc=1 (IP+POT-bound), so we cannot
            // fetch them from the server. ytdl-core-enhanced streams directly
            // and works correctly on localhost (user's IP, not a datacenter IP).
            const itag = itagStr ? parseInt(itagStr, 10) : undefined;
            const filename = encodeURIComponent(`${safeTitle}.mp4`);

            const stream = ytdl(normalizedUrl, {
                quality: itag ?? "highest",
                filter: "videoandaudio",
                requestOptions: {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    },
                },
            });

            return new Response(nodeStreamToWebStream(stream as Readable), {
                headers: {
                    "Content-Type": "video/mp4",
                    "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
                },
            });
        }
    } catch (error: any) {
        console.error("Download API Error:", error.message, error.code ?? "");
        return NextResponse.json(
            { error: error.message ?? "Unknown error", code: error.code ?? null },
            { status: 500 }
        );
    }
}
