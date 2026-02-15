import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
