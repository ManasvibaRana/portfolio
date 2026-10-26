import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import { site } from "@/data/site";
import { bootScript } from "@/lib/bootScript";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.about,
  applicationName: site.studioName,
  authors: [{ name: site.name, url: site.socials.linkedin }],
  keywords: ["Manasviba Rana", "Jr. Software Engineer", "software engineer", "Python developer", "backend", "AI", "portfolio", "Django", "React"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.studioName,
    title,
    description: site.about,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.about,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4e3" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1730" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline boot script sets data-mode / the dark class before hydration.
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
