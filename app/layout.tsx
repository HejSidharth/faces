import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Newsreader } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Notion Faces API — Beautiful Avatar Icons",
  description:
    "Simple REST API for beautiful, random Notion-style avatar icons. No authentication required. Add fun faces to your app in seconds.",
  keywords: [
    "avatar",
    "icons",
    "api",
    "notion",
    "faces",
    "avatars",
    "profile pictures",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Notion Faces API",
    description:
      "Beautiful, random avatar icons for your projects. No auth required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${outfit.variable} ${newsreader.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
