import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username as string,
                    },
                });

                if (!user || !user.passwordHash) {
                    return null; // Or throw Error("User not found")
                }

                // Check password with bcrypt
                // Fallback to strict equality for seed data (dev environment hack)
                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.passwordHash) ||
                    (process.env.NODE_ENV === 'development' && user.passwordHash === credentials.password);

                if (!isPasswordValid) {
                    return null;
                }

                // Return user object for JWT
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role, // Pass role to token
                    username: user.username,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/error", // Error code passed in query string as ?error=
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.username = (user as any).username;
                token.image = user.image;
            }

            // Support updating session
            if (trigger === "update" && session) {
                token = { ...token, ...session };
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).username = token.username;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
