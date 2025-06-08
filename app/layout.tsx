import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MswInitializer } from "@/components/tools/MswInitializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PostPilot",
  description: "AI Agent to create and manage your social media posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MswInitializer>{children}</MswInitializer>
      </body>
    </html>
  );
}
