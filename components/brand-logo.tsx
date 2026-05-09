import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "https://saifuliqbal.dev/veritaslogo.png";

type BrandLogoProps = {
  /** `nav`: marketing top bar · `hero`: auth / large placements · `header` / `compact`: in-page */
  variant?: "nav" | "hero" | "header" | "compact";
  href?: string | null;
  className?: string;
};

export function BrandLogo({
  variant = "header",
  href = "/",
  className,
}: BrandLogoProps) {
  const boxClass =
    variant === "nav"
      ? "h-[4.25rem] w-[min(320px,88vw)] sm:h-[5rem] sm:w-[min(440px,62vw)] lg:h-[5.75rem] lg:w-[min(520px,46vw)]"
      : variant === "hero"
        ? "h-[4.5rem] w-[min(320px,92vw)] sm:h-24 sm:w-[min(460px,90%)] md:h-[6.5rem] md:w-[min(540px,85%)]"
        : variant === "header"
          ? "h-12 w-[min(240px,62vw)] sm:h-14 sm:w-[min(300px,52vw)]"
          : "h-10 w-[min(200px,52vw)] sm:h-11 sm:w-[min(240px,44vw)]";

  const sizes =
    variant === "nav"
      ? "(max-width: 640px) 320px, (max-width: 1024px) 440px, 520px"
      : variant === "hero"
        ? "(max-width: 640px) 320px, (max-width: 768px) 460px, 540px"
        : variant === "header"
          ? "(max-width: 640px) 240px, 300px"
          : "(max-width: 640px) 200px, 240px";

  const imgClass =
    variant === "nav" || variant === "hero"
      ? "object-contain object-left scale-[1.08] sm:scale-110 origin-left"
      : "object-contain object-left";

  const image = (
    <span
      className={`relative block shrink-0 overflow-visible ${boxClass} ${className ?? ""}`}
    >
      <Image
        src={LOGO_SRC}
        alt="VERITAS"
        fill
        priority={variant === "nav" || variant === "hero" || variant === "header"}
        sizes={sizes}
        className={imgClass}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex max-w-full items-center rounded-md outline-none ring-offset-2 ring-offset-veritas-bg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        {image}
      </Link>
    );
  }

  return image;
}
