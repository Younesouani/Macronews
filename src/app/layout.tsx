import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MacroNews | Real-Time Economic Intelligence",
  description: "AI-driven macroeconomic summaries and market sentiment tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
