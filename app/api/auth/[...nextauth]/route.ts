import NextAuth, {Account, AuthOptions} from "next-auth"
import {JWT} from "next-auth/jwt";
import {refreshAccessToken, spotifyProfile} from "@/app/api/auth/[...nextauth]/spotifyProfile";

export type AuthUser = {
    name: string;
    email: string;
    image: string;
    access_token: string;
    token_type: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id: string;
};

export const authOptions: AuthOptions = {
    providers: [spotifyProfile],
    callbacks: {
        async jwt({ token, account }: {token: JWT, account: Account | null}) {
            if (!account) {
                return token;
            }
            token.userId = account.userId
            const updatedToken = {
                ...token,
                access_token: account.access_token,
                token_type: account.token_type,
                expires_at: account.expires_at ?? Date.now() / 1000,
                expires_in: (account.expires_at ?? 0) - Date.now() / 1000,
                refresh_token: account.refresh_token,
                scope: account.scope,
                id: account.providerAccountId,
            };

            if (Date.now() < updatedToken.expires_at) {
                return refreshAccessToken(updatedToken);
            }
            return updatedToken;

        },
        async session({ session, token }: {session: any, token: any}) {
            session.user = {
                ...session.user,
                access_token: token.access_token,
                token_type: token.token_type,
                expires_at: token.expires_at,
                expires_in: token.expires_in,
                refresh_token: token.refresh_token,
                scope: token.scope,
                id: token.userId,
            };
            session.error = token.error;
            return session;
        }
    }


}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };