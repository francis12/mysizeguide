import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mysizeguide.com'),
  title: {
    default: "SizeGuide - Global Size Charts & Converter",
    template: "%s | SizeGuide",
  },
  description: "Find your perfect size with our interactive size converter. Convert between US, UK, EU and CM sizes for all major brands.",
  keywords: ["size chart", "size converter", "shoe size", "clothing size", "size guide"],
  authors: [{ name: "SizeGuide" }],
  openGraph: {
    type: "website",
    siteName: "SizeGuide",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
