import { promises as fs } from 'node:fs';
import path from 'node:path';

const POSTS_DIR = path.join(process.cwd(), 'blog', 'posts');
const OUTPUT_PATH = path.join(process.cwd(), 'blog', 'posts.json');

function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    return { metadata: {}, body: content };
  }

  const end = content.indexOf('\n---\n', 4);
  if (end === -1) {
    return { metadata: {}, body: content };
  }

  const raw = content.slice(4, end).trim();
  const body = content.slice(end + 5).trimStart();
  const metadata = {};

  for (const line of raw.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key) metadata[key] = value;
  }

  return { metadata, body };
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

function excerptFromBody(body) {
  const firstParagraph = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph.length > 0);

  if (!firstParagraph) {
    return '';
  }

  return firstParagraph.replace(/[#*_`>\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
}

function toISODate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

async function buildManifest() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);

  const posts = await Promise.all(
    markdownFiles.map(async (filename) => {
      const fullPath = path.join(POSTS_DIR, filename);
      const raw = await fs.readFile(fullPath, 'utf8');
      const { metadata, body } = parseFrontmatter(raw);
      const slug = metadata.slug || filename.replace(/\.md$/, '');

      let date = toISODate(metadata.date);
      if (!date) {
        const stats = await fs.stat(fullPath);
        date = new Date(stats.mtimeMs).toISOString().slice(0, 10);
      }

      return {
        slug,
        title: metadata.title || titleFromSlug(slug),
        date,
        excerpt: metadata.excerpt || excerptFromBody(body),
        path: `./blog/posts/${filename}`,
      };
    })
  );

  posts.sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.title.localeCompare(b.title);
  });

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(posts, null, 2)}\n`);
  console.log(`Generated ${posts.length} posts in blog/posts.json`);
}

buildManifest().catch((error) => {
  console.error('Failed to generate posts.json', error);
  process.exitCode = 1;
});
