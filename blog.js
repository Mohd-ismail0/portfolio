(async function () {
  const statusEl = document.getElementById('blog-status');
  const listEl = document.getElementById('blog-list');
  const articleEl = document.getElementById('blog-article');

  if (!statusEl || !listEl || !articleEl) return;

  function getSlugFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  }

  function renderList(posts) {
    listEl.innerHTML = posts.map(post => `
      <article class="project-card blog-card">
        <p class="blog-meta">${post.date}</p>
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <a class="project-link" href="blog.html?slug=${encodeURIComponent(post.slug)}">Read post <i class="fa fa-arrow-right"></i></a>
      </article>
    `).join('');
  }

  async function renderPost(post) {
    const response = await fetch(post.path);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${post.path}`);
    }

    const markdown = await response.text();
    const markdownWithoutFrontmatter = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
    articleEl.innerHTML = `
      <a class="project-link" href="blog.html"><i class="fa fa-arrow-left"></i> Back to all posts</a>
      <p class="blog-meta">${post.date}</p>
      <h2>${post.title}</h2>
      <div class="blog-content">${marked.parse(markdownWithoutFrontmatter)}</div>
    `;
    articleEl.hidden = false;
    listEl.hidden = true;
  }

  try {
    const response = await fetch('./blog/posts.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load posts index.');
    }

    const posts = await response.json();
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const slug = getSlugFromQuery();

    if (!slug) {
      renderList(sortedPosts);
      statusEl.textContent = `${sortedPosts.length} post${sortedPosts.length === 1 ? '' : 's'} available.`;
      return;
    }

    const targetPost = sortedPosts.find(post => post.slug === slug);
    if (!targetPost) {
      statusEl.textContent = 'Post not found.';
      return;
    }

    statusEl.hidden = true;
    await renderPost(targetPost);
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Could not load blog posts right now. Please try again later.';
  }
})();
