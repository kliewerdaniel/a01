import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/blog';
import { semanticSearch } from '@/lib/semantic-search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const posts = getBlogPosts();
    const results = await semanticSearch(query, posts, limit);

    return NextResponse.json({
      query,
      count: results.length,
      results: results.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        tags: post.tags,
        readingTime: post.readingTime,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
