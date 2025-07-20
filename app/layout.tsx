'use client';
import { Providers } from './providers';
import Header from "@/app/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
      <Providers>
          <Header/>
          {children}
      </Providers>
      </body>
    </html>
  );
}
