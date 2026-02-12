# Blog automation plan (minimal setup for Netlify free tier)

This repo now uses a static blog architecture designed for low maintenance and easy automation:

- Post markdown files: `blog/posts/*.md`
- Manifest/index: `blog/posts.json`
- Reader UI: `blog.html` + `blog.js`

## Why this is the best minimal approach

1. **Works natively on Netlify free tier**: no server needed; just static files.
2. **Low lock-in**: files live in your Git repo, so any tool can publish.
3. **Custom GPT-ready**: GPT Actions can call GitHub APIs to write files.
4. **Predictable deployment**: every push triggers Netlify auto-deploy.

## How your Custom GPT should publish a new blog

For each new post, it should do two GitHub API writes:

1. Create markdown file at: `blog/posts/<slug>.md`
2. Update `blog/posts.json` to prepend the new post object.

### Post object format in `blog/posts.json`

```json
{
  "slug": "my-new-post",
  "title": "My New Post",
  "date": "2026-02-12",
  "excerpt": "1-2 sentence summary",
  "path": "./blog/posts/my-new-post.md"
}
```

## Suggested GPT Action API surface

Use GitHub REST API through an Action (recommended endpoints):

- `GET /repos/{owner}/{repo}/contents/blog/posts.json`
- `PUT /repos/{owner}/{repo}/contents/blog/posts.json`
- `PUT /repos/{owner}/{repo}/contents/blog/posts/{slug}.md`

Auth: GitHub PAT with `repo` scope (or fine-grained contents write on this repo).

## Optional: trigger immediate redeploy

If your Netlify auto-deploy from Git is enabled, no extra step is needed.
If needed, add a second Action to call a Netlify Build Hook URL after committing.

## Safety checks your GPT should enforce

- Slug is lowercase with dashes only.
- Date in `YYYY-MM-DD`.
- Ensure `path` and filename match slug exactly.
- Avoid duplicate slug entries in `blog/posts.json`.

