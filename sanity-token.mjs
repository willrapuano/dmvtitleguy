/**
 * Resolve a Sanity write token from the environment, for whichever project a script
 * targets.
 *
 * Sanity tokens are scoped to a single project and do not expire — they are valid
 * until revoked. So the intended setup is create-once-per-project, stored in this
 * environment's variables, and never pasted into a chat or a commit again. A token
 * that only ever lives in the environment does not need rotating; one that has been
 * pasted into a transcript does.
 *
 * Two projects are in play, so a single SANITY_API_TOKEN cannot serve both. Rather
 * than demand one exact name, each project accepts several — set whichever you like:
 *
 *   DMV Title Guy   (4s0dloxi)  SANITY_TOKEN_DMVTITLEGUY
 *                               SANITY_TOKEN_4S0DLOXI
 *                               SANITY_API_TOKEN          (fallback)
 *
 *   Candee Currie   (ej27mt39)  SANITY_TOKEN_CANDEE
 *                               SANITY_TOKEN_EJ27MT39
 *                               SANITY_API_TOKEN          (fallback)
 *
 * Note that publish-blog-posts.mjs and Candee's own build both already read
 * SANITY_API_TOKEN, so prefer the project-specific names and leave the generic one to
 * whichever project's build needs it.
 *
 * Needs the Editor role. Viewer cannot write documents, and "Deploy Studio" grants no
 * data access at all despite the name — it only permits `sanity deploy`.
 */

/** projectId → the environment variables that may hold its token, in priority order. */
const TOKEN_VARS = {
  "4s0dloxi": ["SANITY_TOKEN_DMVTITLEGUY", "SANITY_TOKEN_4S0DLOXI", "SANITY_API_TOKEN"],
  ej27mt39: ["SANITY_TOKEN_CANDEE", "SANITY_TOKEN_EJ27MT39", "SANITY_API_TOKEN"],
};

const LABEL = { "4s0dloxi": "DMV Title Guy", ej27mt39: "Candee Currie" };

/**
 * Returns the token, or null when none is set. Read-only work against a public dataset
 * does not need one, so callers that only read should treat null as fine and callers
 * that write should call requireSanityToken instead.
 */
export function sanityToken(projectId) {
  const names = TOKEN_VARS[projectId];
  if (!names) throw new Error(`no token variables registered for project "${projectId}"`);
  for (const name of names) {
    const v = process.env[name];
    if (v && v.trim()) return v.trim();
  }
  return null;
}

/** Which variable a token came from — useful in logs without printing the token. */
export function sanityTokenSource(projectId) {
  for (const name of TOKEN_VARS[projectId] || []) {
    if (process.env[name] && process.env[name].trim()) return name;
  }
  return null;
}

/** Same, but fails with instructions rather than a bare "unauthorized" from the API. */
export function requireSanityToken(projectId) {
  const token = sanityToken(projectId);
  if (token) return token;
  const names = TOKEN_VARS[projectId] || [];
  throw new Error(
    `No Sanity token found for ${LABEL[projectId] || projectId} (${projectId}).\n` +
      `Set one of: ${names.join(", ")}\n\n` +
      `Create it at sanity.io/manage → the ${LABEL[projectId] || projectId} project → ` +
      `API → Tokens → Add API token, with the Editor role.\n` +
      `Check the project switcher first: the tokens page looks identical across projects, ` +
      `and a token issued on the wrong one fails with "Session does not match project host".\n\n` +
      `Store it in this environment's variables rather than pasting it into a message — ` +
      `Sanity tokens do not expire, so an environment-only token is set up once and never ` +
      `needs rotating.`
  );
}
