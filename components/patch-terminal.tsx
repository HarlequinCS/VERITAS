"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

const MOCK_PATCH = `--- a/middleware.ts
+++ b/middleware.ts
@@ -12,7 +12,9 @@ export async function middleware(req: NextRequest) {
-  if (req.nextUrl.pathname.startsWith('/admin')) {
-    return NextResponse.next();
+  if (req.nextUrl.pathname.startsWith('/admin')) {
+    const session = await getSession(req);
+    if (!session?.roles?.includes('admin')) {
+      return NextResponse.redirect(new URL('/login', req.url));
+    }
+    return NextResponse.next();
   }
   return NextResponse.next();
 }`;

export function PatchTerminal() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(MOCK_PATCH);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner">
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-2.5">
        <span className="font-mono text-xs text-neutral-500">suggested_patch.diff</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Patch
            </>
          )}
        </button>
      </div>
      <pre className="max-h-[min(420px,50vh)] overflow-auto p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
        <code className="text-neutral-300">
          <span className="text-neutral-600">{"--- "}</span>
          <span className="text-rose-300">a/middleware.ts</span>
          {"\n"}
          <span className="text-neutral-600">{"+++ "}</span>
          <span className="text-emerald-300">b/middleware.ts</span>
          {"\n"}
          <span className="text-neutral-500">{"@@ -12,7 +12,9 @@ export async function middleware(req: NextRequest) {"}</span>
          {"\n"}
          <span className="text-rose-400/90">{"-  if (req.nextUrl.pathname.startsWith('/admin')) {"}</span>
          {"\n"}
          <span className="text-rose-400/90">{"-    return NextResponse.next();"}</span>
          {"\n"}
          <span className="text-emerald-400/90">{"+  if (req.nextUrl.pathname.startsWith('/admin')) {"}</span>
          {"\n"}
          <span className="text-emerald-400/90">
            {"+    const session = await getSession(req);"}
          </span>
          {"\n"}
          <span className="text-emerald-400/90">
            {"+    if (!session?.roles?.includes('admin')) {"}
          </span>
          {"\n"}
          <span className="text-emerald-400/90">
            {
              "+      return NextResponse.redirect(new URL('/login', req.url));"
            }
          </span>
          {"\n"}
          <span className="text-emerald-400/90">{"+    }"}</span>
          {"\n"}
          <span className="text-emerald-400/90">{"+    return NextResponse.next();"}</span>
          {"\n"}
          <span className="text-neutral-300">{"   }"}</span>
          {"\n"}
          <span className="text-neutral-300">{"   return NextResponse.next();"}</span>
          {"\n"}
          <span className="text-neutral-300">{" }"}</span>
        </code>
      </pre>
    </div>
  );
}
