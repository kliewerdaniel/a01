import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

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
  readingTime?: number; // in minutes
  tableOfContents?: TableOfContentsItem[];
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

// Calculate reading time based on word count (average 200 words per minute)
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Extract headings from markdown content for table of contents
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    // Create slug from title
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({ id, title, level });
  }

  return headings;
}

const blogDirectory = path.join(process.cwd(), 'blog');

export function getBlogPosts(): BlogPost[] {
  // Check if blog directory exists
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

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
        description: data.description,
        categories: data.categories,
        tags: data.tags,
        author: data.author,
        image: data.image,
        content,
        layout: data.layout,
        canonical_url: data.canonical_url,
        readingTime: calculateReadingTime(content),
        tableOfContents: extractTableOfContents(content),
        og: data.og,
        twitter: data.twitter,
      };
    })
    .sort((post1, post2) => {
      const date1 = new Date(post1.date).getTime();
      const date2 = new Date(post2.date).getTime();
      return date2 - date1;
    });

  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description,
    categories: data.categories,
    tags: data.tags,
    author: data.author,
    image: data.image,
    content,
    layout: data.layout,
    canonical_url: data.canonical_url,
    readingTime: calculateReadingTime(content),
    tableOfContents: extractTableOfContents(content),
    og: data.og,
    twitter: data.twitter,
  };
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

// Check if a blog post exists by slug
export function blogPostExists(slug: string): boolean {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  return fs.existsSync(fullPath);
}

// Validate an array of slugs and return only existing ones
export function validateBlogSlugs(slugs: string[]): string[] {
  return slugs.filter(slug => blogPostExists(slug));
}
