import { getBlogPosts } from '@/lib/blog';
import HomeClient from './page-client';

export default function HomePage() {
  const posts = getBlogPosts();
  return <HomeClient posts={posts} />;
}
