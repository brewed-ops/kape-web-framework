# Deploy gate - nothing goes live by accident

Two laws:
1. **The user calls what ships.** Deploy only when they say "deploy" for THIS change. Last week's go does not cover
   today's diff. A push to a branch the host auto-deploys (Cloudflare Pages / Vercel / Netlify production branch)
   IS a deploy and needs the same go.
2. **"Uploaded" is not "live".** A deploy is done when the live site is proven to serve the new build. Until then
   report it as "uploaded, not verified yet".

## 1. Preflight (stop at the first fail)
- Working tree clean, everything committed and pushed: `git status --porcelain` is empty, `git log origin/<branch>..`
  is empty.
- CI is green on THAT commit (`gh run list --commit $(git rev-parse HEAD)`, or the Actions tab).
- Fresh build passes locally: `npm ci && npm run build && npm run check:dist`.
- Scope: list every change since the last deploy (`git log <last-deployed-commit>..HEAD --oneline`) and say it in
  plain words. If the live site has something this build does not (someone edited it by hand, another branch went
  out), STOP: deploying would erase it. Compare by fetching a page and grepping for a string only the live version has.
- Launch content: `npm run check:launch` must PASS (no demo content, `[CONFIRM]` or `TODO(owner)` in any page).
  A placeholder fact must never reach visitors.

## 2. Rollback ready BEFORE upload
- Static hosts keep every deployment: note the current production deployment (Cloudflare Pages / Vercel / Netlify
  dashboard, or `npx wrangler pages deployment list`). Rollback = promote that one.
- Nginx / VPS: copy the live folder first (`cp -a /var/www/site /var/www/site.bak-$(date +%F-%H%M)`). Rollback =
  move it back.
- Say the rollback command out loud in the chat before deploying.

## 3. Deploy
- Git-connected host: merge or push to the production branch. Direct upload: `npx wrangler pages deploy dist`
  (Cloudflare), `npx vercel --prod`, `npx netlify deploy --prod --dir dist`.
- VPS: upload new hashed assets first, then the HTML that loads them, so no visitor gets a page pointing at files
  that are not there yet. Delete stale assets only after the new HTML is live.

## 4. Prove it is live
- Fetch the real domain with cache bypassed (`curl -sI https://<domain>/?v=$(date +%s)`) and find something only
  the new build has.
- `npm run check:headers -- https://<domain>` grades A or better; `/.env` and `/.git/config` return 404.
- Send the contact form once for real and confirm the email arrives.
- `/seo audit https://<domain>`.
- Anything fails: roll back first, fix after. Then report what was deployed, what was checked, and what was not.
