import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron, Share_Tech_Mono } from "next/font/google";
import { MockAuthProvider } from "@/components/mock-auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VERITAS | SCAN. SIMULATE. SOLVE.",
  description:
    "Enterprise-grade cybersecurity platform. Real-time threat intelligence, attack simulation, and AI-driven remediation.",
  icons: {
    icon: "https://saifuliqbal.dev/veritasicon.png",
    apple: "https://saifuliqbal.dev/veritasicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${shareTechMono.variable} min-h-dvh font-sans`}
      >
        <MockAuthProvider>{children}</MockAuthProvider>
      </body>
    </html>
  );
}
