/*
  env.ts - validated public env. Fails the production build with a clear message
  instead of shipping a site whose forms silently do nothing.
  Only PUBLIC_ variables belong here: they are compiled into the browser bundle.
  Server secrets (TURNSTILE_SECRET, CONTACT_WEBHOOK_URL) are read in functions/api/contact.ts only.
*/
const raw = import.meta.env;

export const publicEnv = {
  turnstileSiteKey: String(raw.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim(),
};

if (raw.PROD && !publicEnv.turnstileSiteKey) {
  throw new Error(
    "[env] PUBLIC_TURNSTILE_SITE_KEY is missing. The contact and opt-in forms need it. " +
      "Local/CI: copy .env.example to .env (it ships Cloudflare's always-pass test key). " +
      "Production: set the real site key in your host's build environment, then rebuild.",
  );
}

// Cloudflare documents dummy keys that start with 1x, 2x or 3x. They accept any visitor.
if (raw.PROD && /^[123]x0{10,}/.test(publicEnv.turnstileSiteKey)) {
  console.warn('[env] PUBLIC_TURNSTILE_SITE_KEY is a Cloudflare TEST key. Replace it before launch.');
}
