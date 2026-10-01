import { SiteFooter } from "@/components/site-footer";
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
      <SiteFooter />
    </>
  );
}
