import type { Metadata, Viewport } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { loadBundle } from "@/lib/content";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const revalidate = 60;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#081321",
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await loadBundle();
  return {
    title: {
      default: settings.seo_title || settings.name,
      template: `%s · ${settings.name}`,
    },
    description: settings.seo_description || settings.intro,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
