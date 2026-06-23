import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VERITAS - Web Vulnerability Scanner",
  description: "Automated web vulnerability scanning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
