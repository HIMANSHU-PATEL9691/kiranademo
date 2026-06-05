# Routing fix TODO

## Plan validation
- [x] Inspect TanStack Router generated tree (`src/routeTree.gen.ts`) and router setup (`src/router.tsx`).
- [x] Inspect route files currently contributing unwanted top-level pages (`src/routes/index.tsx`, `about.tsx`, `contact.tsx`, `posts.$postId.tsx`).

## Apply requested changes (remove/disable old root pages)
- [ ] Remove `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/contact.tsx`, `src/routes/posts.$postId.tsx` OR convert them to redirects into the `_app` section.
- [ ] Ensure root route `/` lands on the correct `_app` page (e.g., `/dashboard`).
- [ ] Rebuild to confirm route tree and compilation are correct.

