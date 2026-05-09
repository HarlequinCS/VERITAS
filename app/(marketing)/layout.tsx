import { UniversalNavbar } from "@/components/universal-navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UniversalNavbar />
      {children}
    </>
  );
}
