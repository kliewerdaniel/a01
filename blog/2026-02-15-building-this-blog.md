---
layout: post
title: "Building This Blog: A Technical Deep Dive into My Next.js Markdown-Powered Publishing Platform"
date: 02-15-2026
author: "Daniel Kliewer"
description: "An in-depth look at the technical architecture behind this blog - how I built a performant, markdown-driven publishing system using Next.js, gray-matter, and a custom blog API."
tags: ["next-js", "web-development", "markdown", "typescript", "blog-engine", "jamstack", "software-engineering"]
canonical_url: "https://danielkliewer.com/blog/building-this-blog"
image: "/images/1021019.png"
og:title: "Building This Blog: A Technical Deep Dive"
og:description: "Discover the technical architecture behind this markdown-powered blog built with Next.js, TypeScript, and gray-matter."
og:image: "https://danielkliewer.com/images/1021019.png"
og:url: "https://danielkliewer.com/blog/building-this-blog"
og:type: "article"
twitter:card: "summary_large_image"
twitter:title: "Building This Blog: Technical Architecture"
twitter:description: "How I built a performant markdown-driven blog with Next.js and TypeScript."
twitter:image: "https://danielkliewer.com/images/1021019.png"
---


![Building This Blog](/images/1021019.png)

# Building This Blog: A Technical Deep Dive into My Next.js Markdown-Powered Publishing Platform

I've been meaning to write this post for a while now. After all those blog posts about AI agents, local LLMs, and various technical experiments, it seems only fitting to turn the lens inward and explain how this very blog actually works. This isn't just navel-gazing - understanding your tools deeply makes you a better developer, and I think there's genuine value in sharing the architectural decisions that make this system tick.

## The Foundation: Why Next.js?

When I set out to build this blog, I had several requirements in mind:

1. **Static site generation (SSG)** for performance and SEO
2. **Markdown support** because I wanted to write posts in plain text
3. **Type safety** given my background in TypeScript projects
4. **Easy deployment** with Vercel or similar platforms
5. **Flexibility** to add features like semantic search later

Next.js checked all these boxes. The App Router (or Pages Router, depending on when you're reading this) provides excellent SSG support, and the React foundation means I can embed interactive components when needed.

## The File Structure

Let me walk you through how this blog is organized:

```
a01/
├── blog/                    # All markdown blog posts live here
│   ├── 2024-10-04-detailed-description-of-insight-journal.md
│   ├── 2025-01-16-solo-business-ventures.md
│   └── ... (many more posts)
├── public/
│   ├── images/              # Blog post images
│   └── art/                 # AI-generated artwork
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # React components
│   └── lib/                # Utility functions
│       └── blog.ts         # The core blog API
└── package.json
```

The simplicity is intentional. Every markdown file in the `blog/` directory automatically becomes a blog post. No database, no CMS, no external dependencies. Just files.

## The Core: blog.ts

The heart of this system is `src/lib/blog.ts`. Let me walk you through the key components:

### The BlogPost Interface

First, I defined a TypeScript interface that captures everything we need for a blog post:

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  author?: string;
  image?: string;
  content: string;
  layout?: string;
  canonical_url?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}
```

This interface is comprehensive - it handles not just the basics (title, date, content) but also SEO metadata (Open Graph tags, Twitter cards) and categorization (tags, categories). This is critical for a blog that aims to be discoverable.

### Parsing Markdown with gray-matter

The magic happens through the `gray-matter` library, which parses YAML frontmatter from markdown files. Here's how it works:

```typescript
const { data, content } = matter(fileContents);
```

- `data` contains the frontmatter (title, date, tags, etc.)
- `content` contains the actual markdown body

This separation is elegant because it lets me write metadata alongside content without any special syntax beyond standard YAML.

### Getting All Posts

The `getBlogPosts()` function reads all markdown files and transforms them into our BlogPost interface:

```typescript
export function getBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogDirectory);
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        // ... rest of fields
        content,
      };
    })
    .sort((post1, post2) => {
      const date1 = new Date(post1.date).getTime();
      const date2 = new Date(post2.date).getTime();
      return date2 - date1;
    });

  return posts;
}
```

The sorting logic at the end ensures newest posts first - a standard blog expectation.

### Getting Individual Posts

For rendering individual blog pages, we have `getBlogPost(slug)`:

```typescript
export function getBlogPost(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    // ... populate all fields
    content,
  };
}
```

This is straightforward - we construct the file path from the slug, read the file, parse the frontmatter, and return the post (or null if it doesn't exist).

## The Frontmatter Schema

Every blog post in this system follows a consistent frontmatter schema:

```markdown
---
layout: post
title: "Your Post Title"
date: "02-15-2026"
author: "Daniel Kliewer"
description: "A brief description for SEO and previews"
tags: ["tag1", "tag2", "tag3"]
canonical_url: "https://example.com/your-post"
image: "/images/your-image.png"
og:title: "Custom OG title (optional)"
og:description: "Custom OG description (optional)"
og:image: "https://example.com/image.png"
og:url: "https://example.com/your-post"
og:type: "article"
twitter:card: "summary_large_image"
twitter:title: "Custom Twitter title"
twitter:description: "Custom Twitter description"
twitter:image: "https://example.com/image.png"
---
```

This comprehensive frontmatter is what enables:
- **SEO optimization** through meta tags
- **Social sharing** through Open Graph and Twitter cards
- **Categorization** through tags and categories
- **Canonical URLs** to prevent duplicate content issues

## Rendering Posts

In the Next.js app router, individual posts are rendered using dynamic routes. The slug parameter determines which markdown file to read:

```typescript
// src/app/blog/[slug]/page.tsx
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog';

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  // Render the post using a markdown parser
  return <BlogPostContent post={post} />;
}
```

The `generateStaticParams` function enables static site generation - Next.js will pre-build all blog post pages at build time.

## Why This Approach Works

After maintaining this blog for a while, here's what I've learned:

### Pros

1. **Simplicity**: No database, no CMS, no authentication. Just files.
2. **Version control**: Every post is just a text file. Git handles history, branching, and collaboration.
3. **Performance**: Static generation means fast page loads.
4. **Portability**: If I ever want to move platforms, I just take my markdown files.
5. **Developer experience**: Writing in markdown with a good editor is a pleasure.

### Cons

1. **No dynamic features**: Comments, likes, and real-time updates require additional infrastructure.
2. **Build times**: As the blog grows, build times increase (though this hasn't been an issue yet).
3. **Image management**: Manually managing images in a folder requires discipline.

## Future Enhancements I'm Considering

This blog is never "done" - it's a living system. Here are some features I'd like to add:

1. **Semantic search**: Using local embeddings (Ollama) to enable concept-based search
2. **Related posts**: AI-generated recommendations based on content similarity
3. **Reading time**: Auto-calculated based on word count
4. **Table of contents**: Auto-generated from headings
5. **Syntax highlighting**: For code blocks (essential for a technical blog)

## Conclusion

Building this blog taught me a lot about the intersection of simplicity and capability. By leveraging Next.js static generation, TypeScript type safety, and markdown's elegance, I created a system that's easy to maintain, fast to deploy, and pleasant to write for.

The key insight isn't any particular technology - it's the principle of **local-first, file-based architecture**. When your content lives as plain text files, you gain flexibility, durability, and simplicity that no CMS can match.

If you're building a personal blog or portfolio, I highly recommend this approach. Start simple, add complexity only when needed, and always prioritize your writing experience over fancy features.

Happy blogging!

![Blog Architecture](/images/1021018.png)
