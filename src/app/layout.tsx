import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const exhibitionSerif = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Токсичник",
  description: "Цифровая инсталляция — объект исследования",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${exhibitionSerif.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
