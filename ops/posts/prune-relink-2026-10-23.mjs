// Prune release 1 (2026-10-23): point body links at the pages the merged posts now
// 301 to, so no post links through a redirect.
//   node ops/posts/prune-relink-2026-10-23.mjs --backup | --fixture <out.json> | --publish
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "node:fs";

const env = readFileSync(new URL("../../../site/.env.local", import.meta.url), "utf8");
const token = env.match(/^SANITY_API_TOKEN=["']?([^"'\n]+)/m)[1];
const client = createClient({ projectId: "4s0dloxi", dataset: "production", token, useCdn: false, apiVersion: "2024-01-01" });
const merges = new Map(JSON.parse(readFileSync("/tmp/dmv-merges.json", "utf8")));
const norm = (h) => (h.replace(/^https?:\/\/(www\.)?dmvtitleguy\.(io|com)/, "").split(/[?#]/)[0].replace(/\/$/, "") || "/");

const posts = await client.fetch('*[_type=="post" && !(_id in path("drafts.**"))]{_id,_rev,"slug":slug.current,title,excerpt,body}');
const plans = [];
for (const post of posts) {
  let changed = 0;
  const walk = (o) => {
    if (Array.isArray(o)) return o.map(walk);
    if (o && typeof o === "object") {
      const copy = Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)]));
      if (copy._type === "link" && typeof copy.href === "string" && merges.has(norm(copy.href))) {
        copy.href = merges.get(norm(copy.href));
        changed++;
      }
      return copy;
    }
    return o;
  };
  const body = walk(post.body);
  if (changed) plans.push({ id: post._id, rev: post._rev, slug: post.slug, body, changed, post });
}

const mode = process.argv[2];
if (mode === "--backup") {
  writeFileSync(new URL("../backups/prune-relink.2026-10-23.json", import.meta.url), JSON.stringify(plans.map((p) => p.post), null, 2));
  console.log("backed up", plans.length, "posts,", plans.reduce((n, p) => n + p.changed, 0), "links");
} else if (mode === "--fixture") {
  const byId = new Map(plans.map((p) => [p.id, p.body]));
  writeFileSync(process.argv[3], JSON.stringify(posts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, body: byId.get(p._id) || p.body }))));
  console.log("fixture", posts.length);
} else if (mode === "--publish") {
  const tx = client.transaction();
  for (const p of plans) tx.patch(p.id, (patch) => patch.ifRevisionId(p.rev).set({ body: p.body }));
  console.log("committed", (await tx.commit()).transactionId, plans.length, "posts");
} else {
  console.log(plans.map((p) => `${p.slug}: ${p.changed}`).join("\n"));
}
