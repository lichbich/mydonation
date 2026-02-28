import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("videoUrl");
    const filename = searchParams.get("filename") ?? "facebook-video.mp4";
    const quality = searchParams.get("quality") ?? "sd";

    if (!videoUrl) {
        return NextResponse.json({ error: "Missing videoUrl" }, { status: 400 });
    }

    try {
        const res = await fetch(videoUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                Referer: "https://www.facebook.com/",
                Origin: "https://www.facebook.com",
            },
        });

        if (!res.ok || !res.body) {
            return NextResponse.json({ error: `CDN error: ${res.status}` }, { status: 502 });
        }

        const safeFilename = encodeURIComponent(filename);
        const headers: Record<string, string> = {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        };
        const cl = res.headers.get("content-length");
        if (cl) headers["Content-Length"] = cl;

        return new Response(res.body, { headers });
    } catch (error: any) {
        console.error("Facebook download error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
