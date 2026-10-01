import type { Metadata } from "next";
import Link from "next/link";
import { MarketingActions } from "@/components/marketing-actions";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "VERITAS blog",
  description:
    "Guides for reading a VERITAS finding, testing an application you own, and running a remediation queue.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const visible = category
    ? posts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
    : posts;
  const [featured, ...rest] = visible;
  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">Blog</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
          Notes on testing your own applications.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          Guides for reading a finding and running a remediation queue. New pieces are published when they describe the product as it works.
        </p>
        <MarketingActions
          primaryHref="/register"
          primaryLabel="Create account"
          secondaryHref="/platform"
          secondaryLabel="Explore the platform"
        />
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/blog" className="rounded-full border border-veritas-electric/40 px-3 py-1.5 text-sm text-white">
            All
          </Link>
          <Link href="/blog?category=guides" className="rounded-full border border-veritas-border-subtle px-3 py-1.5 text-sm text-slate-300">
            Guides
          </Link>
        </div>
      </section>

      {featured ? (
        <article className="mx-auto mt-12 max-w-6xl rounded-2xl border border-veritas-border-subtle bg-veritas-surface/40 p-6 sm:p-8">
          <p className="font-label text-xs uppercase tracking-[0.16em] text-veritas-electric">{featured.category}</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{featured.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{featured.description}</p>
          <p className="mt-3 text-sm text-slate-500">{featured.date}</p>
          <Link href={`/blog/${featured.slug}`} className="mt-6 inline-flex text-sm font-semibold text-veritas-electric">
            Read the guide
          </Link>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <ul className="mx-auto mt-8 grid max-w-6xl gap-4">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block rounded-2xl border border-veritas-border-subtle p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-veritas-electric">{post.category}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
