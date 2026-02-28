import { NextResponse } from "next/server";
// @ts-ignore
import ytdl from "ytdl-core-enhanced";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url || !ytdl.validateURL(url)) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    try {
        const info = await ytdl.getInfo(url);
        const { title, keywords, thumbnails, videoId } = info.videoDetails;

        const thumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : "";

        // Extract formats
        const formats = info.formats;

        // Find the best combined formats (Video + Audio)
        // Usually returning 720p and 360p as reliable options without ffmpeg
        const videoFormats = ytdl.filterFormats(formats, "videoandaudio").map((f: any) => ({
            itag: f.itag,
            quality: f.qualityLabel,
            mime: f.mimeType?.split(";")[0],
            hasVideo: f.hasVideo,
            hasAudio: f.hasAudio
        }));

        // Deduplicate qualities (e.g. if multiple 360p exist, take the first)
        const uniqueVideoFormats = videoFormats.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.quality === v.quality)) === i);

        // Find best audio formats
        const audioFormats = ytdl.filterFormats(formats, "audioonly").map((f: any) => ({
            itag: f.itag,
            quality: f.audioBitrate + "kbps",
            mime: f.mimeType?.split(";")[0],
            hasVideo: f.hasVideo,
            hasAudio: f.hasAudio
        }));

        // Take top 3 highest audio
        const topAudioFormats = audioFormats
            .map((f: any) => ({ ...f, bitrate: parseInt(f.quality) || 0 }))
            .sort((a: any, b: any) => b.bitrate - a.bitrate)
            .filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.quality === v.quality)) === i)
            .slice(0, 3);

        return NextResponse.json({
            id: videoId,
            title,
            tags: keywords || [],
            thumbnail,
            formats: {
                video: uniqueVideoFormats,
                audio: topAudioFormats
            }
        });
    } catch (error: any) {
        console.error("YouTube parse error:", error);
        return NextResponse.json({ error: "Failed to parse YouTube video" }, { status: 500 });
    }
}
