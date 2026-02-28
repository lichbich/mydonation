import { NextResponse } from "next/server";
// @ts-ignore
import ytdl from "ytdl-core-enhanced";
import { Readable } from "stream";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Helper to convert Node.js Readable stream to Web stream
function nodeStreamToWebStream(nodeStream: Readable) {
    return new ReadableStream({
        start(controller) {
            nodeStream.on("data", (chunk) => {
                controller.enqueue(new Uint8Array(chunk));
            });
            nodeStream.on("end", () => {
                controller.close();
            });
            nodeStream.on("error", (err) => {
                controller.error(err);
            });
        },
        cancel() {
            nodeStream.destroy();
        },
    });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const format = searchParams.get("format"); // e.g., 'mp4', 'mp3', '1080p', '720p'

    if (!url || !ytdl.validateURL(url)) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    try {
        const info = await ytdl.getInfo(url);
        let selectedFormat;
        let contentType = "video/mp4";
        let extension = "mp4";

        const itag = searchParams.get("itag");

        if (itag) {
            selectedFormat = info.formats.find((f: any) => f.itag === parseInt(itag, 10));
        } else if (format === "mp3" || format === "audio") {
            // Find highest audio format, prefer mp4/m4a container
            const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
            selectedFormat = audioFormats.find((f: any) => f.container === 'mp4') || audioFormats[0];
        } else {
            // Let's try to get video with audio combined
            let qualityLabel = 'highest';
            if (format === '1080p') qualityLabel = '137';
            else if (format === '720p') qualityLabel = '136';
            else if (format === '480p') qualityLabel = '135';
            else if (format === '360p') qualityLabel = '18';

            selectedFormat = info.formats.find((f: any) => f.hasVideo && f.hasAudio && f.qualityLabel?.includes(format || ''));

            if (!selectedFormat) {
                selectedFormat = ytdl.chooseFormat(info.formats, { filter: 'videoandaudio' });
            }
            if (!selectedFormat) {
                selectedFormat = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });
            }
        }

        if (selectedFormat) {
            extension = selectedFormat.container || (selectedFormat.hasVideo ? "mp4" : "mp3");

            // Map webm audio to mp3 or native webm depending on container, but let's encourage m4a/mp3
            if ((extension === "webm" || extension === "weba" || extension === "m4a") && !selectedFormat.hasVideo) {
                extension = "mp3";
            }

            contentType = selectedFormat.mimeType?.split(';')[0] || (selectedFormat.hasVideo ? "video/mp4" : "audio/mpeg");
        }

        if (!selectedFormat) {
            return NextResponse.json({ error: "No suitable format found" }, { status: 404 });
        }

        const safeTitle = info.videoDetails.title.replace(/[\/\?<>\\:\*\|":]/g, "_");
        const filename = encodeURIComponent(`${safeTitle}.${extension}`);

        // Stream from YouTube
        const stream = ytdl.downloadFromInfo(info, { format: selectedFormat });

        let webStream;
        if (typeof Readable.toWeb === 'function') {
            webStream = Readable.toWeb(stream as any);
        } else {
            // Polyfill fallback just in case
            webStream = new ReadableStream({
                start(controller) {
                    stream.on("data", (chunk: any) => controller.enqueue(new Uint8Array(chunk)));
                    stream.on("end", () => controller.close());
                    stream.on("error", (err: any) => controller.error(err));
                },
                cancel() {
                    stream.destroy();
                },
            });
        }

        const responseHeaders: any = {
            "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${filename}`,
            "Content-Type": contentType,
        };

        if (selectedFormat.contentLength) {
            responseHeaders["Content-Length"] = selectedFormat.contentLength;
        }

        return new NextResponse(webStream as any, { headers: responseHeaders });
    } catch (error: any) {
        console.error("YouTube Download API Error:", error);
        return NextResponse.json({ error: "Lỗi tải video từ máy chủ" }, { status: 500 });
    }
}
