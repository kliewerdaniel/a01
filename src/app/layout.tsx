import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load Playfair Display for headings
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Kliewer",
  description: "Personal website of Daniel Kliewer - Software Engineer building with AI, LLMs, and local-first systems",
  keywords: ["AI", "LLM", "RAG", "Software Engineer", "Python", "TypeScript", "Next.js", "Blog", "Projects"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <SiteNav />
        <main className="min-h-screen">
          {children}
        </main>
        
      </body>
    </html>
  );
}
