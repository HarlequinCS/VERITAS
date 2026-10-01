export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: "Guides";
  date: string;
};

export const posts: BlogPost[] = [
  {
    slug: "how-to-read-a-finding",
    title: "How to read a VERITAS finding",
    description:
      "What the target, evidence, severity, weakness labels, and ticket tell you after a scan.",
    category: "Guides",
    date: "2026-10-02",
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
