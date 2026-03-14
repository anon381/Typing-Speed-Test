/**
 * RootLayout.tsx
 * -------------------
 * This is the root layout component for a Next.js 13+ app using the App Router.
 * It sets up global styles, fonts, and metadata for the entire application.
 *
 * Key Features:
 * 1. Imports Google Fonts:
 *    - Geist (sans-serif) and Geist Mono (monospace) with Latin subset.
 *    - Sets CSS variables (--font-geist-sans, --font-geist-mono) for use in styles.
 *
 * 2. Exports Metadata:
 *    - `title`: Page title
 *    - `description`: Page description for SEO and social previews
 *
 * 3. RootLayout Component:
 *    - Wraps all pages in <html> and <body> tags.
 *    - Applies imported font variables and antialiasing via className.
 *    - Accepts `children` (all nested page components) and renders them inside <body>.
 *
 * Usage:
 * This layout will automatically be applied to all pages in the Next.js app
 * if placed in the `app` directory as `layout.tsx`.
 */

import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TurboType",
  description: "Typing practice: improve your WPM, accuracy, and track progress.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "TurboType",
    description: "Typing practice: improve your WPM, accuracy, and track progress.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${figtree.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
