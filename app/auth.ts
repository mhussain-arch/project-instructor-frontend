import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const refreshedToken = await response.json()

        if (!response.ok) throw refreshedToken;

        return {
            ...token,
            accessToken: refreshedToken.accessToken,
            refreshToken: refreshedToken.refreshToken ?? token.refreshToken,
            expiresAt: Date.now() + 14 * 60 * 1000,
        };
    } catch (error) {
        console.error("RefreshAccessTokenError", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                });

                const user = await res.json();

                if (res.ok && user) {
                    return user;
                }
                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    role: user.user.role,
                    id: user.user.id,
                    expiresAt: Date.now() + 14 * 60 * 1000,
                };
            }

            if (Date.now() < token.expiresAt) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.error = token.error;
            session.user.role = token.role;
            session.user.id = token.id;

            return session
        },
    },
    pages: {
        signIn: "/login"
    }
})