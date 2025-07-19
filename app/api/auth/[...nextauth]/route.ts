import NextAuth, {AuthOptions} from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";
import {scopes} from "@/app/_lib/spotify";


export const authOptions: AuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: {
                url: 'https://accounts.spotify.com/authorize',
                params: {
                    scope: scopes.join(','),
                    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.userId = account.userId
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.userId as string;
            }
            return session;
        }
    }


}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };