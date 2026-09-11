import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Quản trị", template: "%s · TechHala Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
