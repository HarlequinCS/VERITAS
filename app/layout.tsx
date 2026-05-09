import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MockAuthProvider } from "@/components/mock-auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VERITAS | Cybersecurity Command Center",
  description:
    "AI-driven offensive security platform. Detect. Prove. Patch.",
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
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-dvh font-sans`}
      >
        <MockAuthProvider>{children}</MockAuthProvider>
      </body>
    </html>
  );
}
