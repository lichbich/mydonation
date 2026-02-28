import { NextResponse } from "next/server";
// @ts-ignore
import { getFbVideoInfo } from "fb-downloader-scrapper";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url || !(url.includes("facebook.com") || url.includes("fb.watch"))) {
        return NextResponse.json({ error: "Invalid Facebook URL" }, { status: 400 });
    }

    try {
        const info = await getFbVideoInfo(url);

        if (!info || (!info.hd && !info.sd)) {
            return NextResponse.json(
                { error: "Could not find video download links. The video may be private or require login." },
                { status: 404 }
            );
        }

        // Map fb-downloader-scrapper's output to our UI expected schema
        return NextResponse.json({
            title: info.title || "Facebook Video",
            thumbnail: info.thumbnail || "",
            hdUrl: info.hd || null,
            sdUrl: info.sd || null,
        });
    } catch (error: any) {
        console.error("Facebook API error:", error.message);
        return NextResponse.json({ error: "Failed to fetch video info. The video may be private." }, { status: 500 });
    }
}
