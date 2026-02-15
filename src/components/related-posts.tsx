'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Loader2 } from 'lucide-react';

interface RelatedPost {
  slug: string;
  title: string;
  description?: string;
  readingTime?: number;
}

interface RelatedPostsProps {
  currentSlug: string;
  searchQuery: string;
}

export function RelatedPosts({ currentSlug, searchQuery }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=3`
        );
        const data = await response.json();
        
        if (data.results) {
          // Filter out current post and limit to 3
          const filtered = data.results
            .filter((post: RelatedPost) => post.slug !== currentSlug)
            .slice(0, 3);
          setRelatedPosts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (searchQuery) {
      fetchRelatedPosts();
    }
  }, [currentSlug, searchQuery]);

  if (isLoading) {
    return (
      <section className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Related Articles
        </h2>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading related articles...
        </div>
      </section>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Related Articles
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group block p-4 rounded-xl bg-card border border-border hover:border-white/30 transition-all"
          >
            <h3 className="font-semibold text-foreground group-hover:text-white transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            )}
            {post.readingTime && (
              <span className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
