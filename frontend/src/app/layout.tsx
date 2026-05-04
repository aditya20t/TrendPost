import type { Metadata } from "next";
import { Inter, Outfit, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-merriweather" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "TrendPost | AI LinkedIn Agent",
  description: "Generate viral LinkedIn posts from trending topics and links.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${merriweather.variable} ${jetbrains.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
