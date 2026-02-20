import { NextResponse } from 'next/server';
import { getAllBlogSlugs } from '@/lib/blog';

export async function GET() {
  try {
    const slugs = getAllBlogSlugs();
    
    return NextResponse.json({
      slugs,
      count: slugs.length
    });
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return NextResponse.json(
      { error: 'Failed to get blog slugs', slugs: [] },
      { status: 500 }
    );
  }
}
