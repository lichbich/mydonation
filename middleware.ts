import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected routes that require authentication
    const protectedRoutes = ["/dashboard"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        const session = await auth();

        // Not logged in - redirect to login
        if (!session?.user) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Creator-only dashboard routes
        const creatorOnlyRoutes = ["/dashboard/actions", "/dashboard/posts", "/dashboard/gallery", "/dashboard/tiers", "/dashboard/requests", "/dashboard/earnings"];
        const isCreatorOnlyRoute = creatorOnlyRoutes.some((route) => pathname.startsWith(route));

        if (isCreatorOnlyRoute) {
            const user = session.user as any;
            if (user.role !== "CREATOR") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }
    }

    // Auth routes - redirect if already logged in
    const authRoutes = ["/auth/login", "/auth/register"];
    if (authRoutes.includes(pathname)) {
        const session = await auth();
        if (session?.user) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/auth/:path*",
    ],
};
