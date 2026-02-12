# Blog automation plan (minimal setup for Netlify free tier)

This repo now uses a static blog architecture designed for low maintenance and easy automation:

- Post markdown files: `blog/posts/*.md`
- Auto-generated manifest/index: `blog/posts.json`
- Generator script: `scripts/generate-posts-json.mjs`
- Reader UI: `blog.html` + `blog.js`

## Why this is the best minimal approach

1. **Works natively on Netlify free tier**: no server needed; just static files.
2. **Low lock-in**: files live in your Git repo, so any tool can publish.
3. **Custom GPT-ready**: GPT Actions can call GitHub APIs to write files.
4. **Predictable deployment**: every push triggers Netlify auto-deploy.

## Build-time generation on Netlify

`netlify.toml` runs this command during each deploy:

```bash
node scripts/generate-posts-json.mjs
```

The script scans `blog/posts/*.md`, reads optional frontmatter, and writes `blog/posts.json` automatically.

## Markdown frontmatter (recommended)

Each post can include YAML-style frontmatter for explicit metadata:

```md
---
title: My New Post
date: 2026-02-12
excerpt: 1-2 sentence summary
slug: my-new-post
---

Post body...
```

If fields are missing, the script falls back to sensible defaults:

- `slug`: filename without `.md`
- `title`: title-cased slug
- `date`: file modified date
- `excerpt`: first paragraph of content

## Suggested GPT Action API surface

Use GitHub REST API through an Action (recommended endpoints):

- `PUT /repos/{owner}/{repo}/contents/blog/posts/{slug}.md`

Auth: GitHub PAT with `repo` scope (or fine-grained contents write on this repo).

## Optional: trigger immediate redeploy

If your Netlify auto-deploy from Git is enabled, no extra step is needed.
If needed, add a second Action to call a Netlify Build Hook URL after committing.

## Safety checks your GPT should enforce

- Slug is lowercase with dashes only.
- Date in `YYYY-MM-DD`.
- Ensure frontmatter `slug` and filename align.
