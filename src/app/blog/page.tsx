import { getBlogPosts } from '@/lib/blog';
import BlogPageClient from './page-client';

export default function BlogPage() {
  const posts = getBlogPosts();
  return <BlogPageClient posts={posts} />;
}
