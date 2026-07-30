# Build Wed Apr 15 11:33:42 EDT 2026
# Redeploy Wed Apr 15 12:06:39 EDT 2026
# Cache bust Wed Apr 15 12:10:09 EDT 2026

## Sanity access for scripts

Two Sanity projects are in play and a token is scoped to one project, so a single
variable cannot serve both:

| project | id | token variables (first match wins) |
| --- | --- | --- |
| DMV Title Guy | `4s0dloxi` | `SANITY_TOKEN_DMVTITLEGUY`, `SANITY_TOKEN_4S0DLOXI`, `SANITY_API_TOKEN` |
| Candee Currie | `ej27mt39` | `SANITY_TOKEN_CANDEE`, `SANITY_TOKEN_EJ27MT39`, `SANITY_API_TOKEN` |

`sanity-token.mjs` resolves these. Prefer the project-specific names and leave
`SANITY_API_TOKEN` free: `publish-blog-posts.mjs` reads it, and Candee's site needs it
at build time or `/sell` fails to prerender.

### Where to put them

**`.env.local` in the repo root, and run the scripts from your own terminal.** That file
is gitignored (`.env*.local`), it stays on your machine, and it never passes through a
conversation. `sanity-token.mjs` loads it automatically, the same way
`publish-blog-posts.mjs` already does:

```
SANITY_TOKEN_DMVTITLEGUY=sk...
SANITY_TOKEN_CANDEE=sk...
```

An exported shell variable overrides the file, so a one-off run can use a different
token without editing anything.

If you started a session on the web, `claude --teleport` pulls it down to your terminal,
where that file is readable.

A cloud environment's variables also work and survive container restarts, but that
config has no secrets store and is readable by anyone using the environment — fine for
a personal environment, not for an organization-shared one.

Sanity tokens do not expire, so this is set up once. The tokens that want revoking are
the ones pasted into a chat: those sit in a transcript you cannot edit.

Create at sanity.io/manage → the project → API → Tokens → Add API token:

- **Editor** is the role scripts need. It is the minimum that can write documents.
- **Viewer** cannot write. **Deploy Studio** grants no data access at all despite the
  name — it exists only to permit `sanity deploy`.
- Check the project switcher before creating one. The tokens page is identical across
  projects, and a token issued on the wrong project fails with
  `Session does not match project host`.

Read-only scripts need no token: both datasets are publicly readable. A token only adds
access to drafts.

### Scripts

| script | writes? | what it does |
| --- | --- | --- |
| `content-cannibalisation-audit.mjs` | no | flags posts competing with a landing page, and any two posts sharing a title. Exits non-zero on a real problem, so it can gate publishing. |
| `dedup-check.cjs` | no | title-similarity checks. Also importable — `publish-blog-posts.mjs` gates on it. |
| `sanity-title-sync.mjs` | yes | pushes `h1` overrides from `src/lib/post-titles.ts` into the CMS, then the override should be deleted. Dry-runs unless passed `--apply`. |
| `publish-blog-posts.mjs` | yes | publishes queued markdown. Refuses a post whose title duplicates a live one. |

Candee's repo has its own `scripts/sanity-content-audit.mjs`, which checks for stand-in
images, document types the site never queries, and bodies stored as markdown strings.
