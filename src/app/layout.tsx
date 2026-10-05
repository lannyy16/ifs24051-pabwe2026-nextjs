
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = { title: "Postingan", description: "Aplikasi Postingan Delcom" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://ui-avatars.com" />
      </head>
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
