import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { PHProvider } from "@/components/posthog-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "LinkedIn Audit — почему западные рекрутеры тебя не замечают",
  description:
    "Бесплатный AI-аудит LinkedIn-профиля для русскоязычных специалистов в US/EU. Узнай за 60 секунд, что отпугивает рекрутеров.",
  openGraph: {
    title: "LinkedIn Audit — почему западные рекрутеры тебя не замечают",
    description:
      "Бесплатный AI-аудит LinkedIn-профиля для русскоязычных специалистов в US/EU. Узнай за 60 секунд, что отпугивает рекрутеров.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LinkedIn Audit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Audit — почему западные рекрутеры тебя не замечают",
    description:
      "Бесплатный AI-аудит LinkedIn-профиля для русскоязычных специалистов в US/EU. Узнай за 60 секунд, что отпугивает рекрутеров.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <PHProvider>{children}</PHProvider>
        </Suspense>
      </body>
    </html>
  );
}
