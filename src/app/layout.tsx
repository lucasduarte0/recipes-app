import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playful = Playfair_Display({
  variable: "--font-playful",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Recipes App',
    default: 'Recipes App - Discover & Share Culinary Creations'
  },
  description: 'Explore, create, and share your favorite recipes with our vibrant cooking community. Find inspiration for every meal and occasion.',
  applicationName: 'Recipes App',
  authors: [{ name: 'Recipes App Team' }],
  generator: 'Next.js',
  keywords: ['recipes', 'cooking', 'food', 'culinary', 'dishes', 'meal planning'],
  themeColor: '#f43f5e',
  colorScheme: 'light dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Recipes App - Discover & Share Culinary Creations',
    description: 'Explore, create, and share your favorite recipes with our vibrant cooking community.',
    url: 'https://recipes-app.com',
    siteName: 'Recipes App',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipes App - Discover & Share Culinary Creations',
    description: 'Explore, create, and share your favorite recipes with our vibrant cooking community.',
    images: ['/twitter-image.png'],
    creator: '@recipesapp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playful.variable} antialiased`}>
        <Providers>{children}</Providers>
        <BottomNav />
      </body>
    </html>
  );
}
