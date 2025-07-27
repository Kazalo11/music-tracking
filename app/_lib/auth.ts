import {Account, AuthOptions} from "next-auth";
import {refreshAccessToken, spotifyProfile} from "@/app/api/auth/[...nextauth]/spotifyProfile";
import {JWT} from "next-auth/jwt";
import {GetServerSidePropsContext, NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";

export const authOptions: AuthOptions = {
    providers: [spotifyProfile],
    callbacks: {
        async jwt({ token, account }: {token: JWT, account: Account | null}) {
            if (!account) {
                return token;
            }
            console.log(account);
            const updatedToken = {
                ...token,
                access_token: account.access_token,
                token_type: account.token_type,
                expires_at: account.expires_at ?? Date.now() / 1000,
                expires_in: (account.expires_at ?? 0) - Date.now() / 1000,
                refresh_token: account.refresh_token,
                scope: account.scope,
                id: account.userId,
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
                id: token.id,
            };
            session.error = token.error;
            return session;
        }
    }


}

export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
    return getServerSession(...args, authOptions);
}

