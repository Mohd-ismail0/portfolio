This blog is now powered by a **minimal static setup**:

- Each post is a markdown file in `blog/posts/`.
- `blog/posts.json` acts as the content index.
- Netlify rebuilds and publishes automatically whenever the repository changes.

## Why this setup

It keeps the website fast, simple, and low-maintenance while still enabling automation from external tools.

## Publishing workflow

1. Add a markdown file with a date-based filename.
2. Add one JSON entry in `blog/posts.json`.
3. Push to GitHub.
4. Netlify deploys the new post.

This gives a clean path for AI-assisted publishing without introducing a full CMS.
