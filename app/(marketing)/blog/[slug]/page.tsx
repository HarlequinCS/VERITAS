import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "VERITAS blog" };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || slug !== "how-to-read-a-finding") notFound();

  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-slate-400 hover:text-white">
          Back to blog
        </Link>
        <p className="mt-8 font-label text-xs uppercase tracking-[0.16em] text-veritas-electric">{post.category}</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{post.date}</p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300">
          <p>
            A VERITAS finding is the record of one weakness on an application you registered. Read it from the target outward: where it happened, what was captured, how serious it is, what class of weakness it is, and who is supposed to fix it.
          </p>
          <h2 className="text-2xl font-semibold text-white">The target</h2>
          <p>
            The target is the application URL and environment you entered, with optional authentication. The finding belongs to a scan session for that target. If the session failed, the status is Failed and there is no completed proof to review.
          </p>
          <h2 className="text-2xl font-semibold text-white">The evidence</h2>
          <p>
            The finding keeps the path that was exercised, the response or page change, and a screenshot when the browser run captured one. The Evidence section is there so a developer can see the route, not only a severity word.
          </p>
          <h2 className="text-2xl font-semibold text-white">Severity</h2>
          <p>
            Severity is Critical, High, Medium, or Low. It tells you the order to work in. It does not replace the path. A Critical finding still needs the endpoint and the evidence next to it.
          </p>
          <h2 className="text-2xl font-semibold text-white">CWE and OWASP</h2>
          <p>
            CWE names the weakness, such as CWE-285 for improper authorization. OWASP names the category, such as A01 for broken access control. Those labels sit on the finding so the suggested fix matches a known class of issue. The example in the product is an authenticated user reaching /admin/users without an admin role.
          </p>
          <h2 className="text-2xl font-semibold text-white">The ticket</h2>
          <p>
            The ticket is how the finding leaves the report. Status is Open, In Progress, Resolved, or Closed. On a team workspace a lead assigns it to a developer. On a solo workspace you use the same queue yourself. The suggested code change is on the finding, in the Fix section, before the ticket is closed.
          </p>
        </div>
        <nav className="mt-12 flex flex-wrap gap-4 border-t border-veritas-border-subtle pt-6 text-sm">
          <Link href="/platform" className="text-veritas-electric">Platform</Link>
          <Link href="/how-it-works" className="text-veritas-electric">How it works</Link>
          <Link href="/pricing" className="text-veritas-electric">Pricing</Link>
        </nav>
      </article>
    </main>
  );
}
