import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BlogPage() {
  const posts = getBlogPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - High Contrast Black/White */}
      <section className="relative overflow-hidden bg-background">
        {/* Subtle gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container px-4 py-24 mx-auto relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 text-sm px-4 py-1 border-white/20 text-foreground">
              Blog
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-6 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Thoughts & Insights
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Exploring the intersection of AI, software development, and human creativity. 
              Deep dives into technology, philosophy, and building the future.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge variant="outline" className="border-white/20 text-foreground">
                {posts.length} Articles
              </Badge>
              <Badge variant="outline" className="border-white/20 text-foreground">
                AI & Machine Learning
              </Badge>
              <Badge variant="outline" className="border-white/20 text-foreground">
                Software Development
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post - Editorial Style */}
      {featuredPost && (
        <section className="container px-4 py-16 mx-auto">
          <h2 className="text-lg font-semibold text-muted-foreground mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground" />
            Latest Article
          </h2>
          <Link href={`/blog/${featuredPost.slug}`} className="group">
            <article className="relative grid md:grid-cols-2 gap-8 items-center p-8 rounded-2xl bg-card border border-border hover:border-white/30 transition-all duration-500 hover:shadow-lg hover:shadow-white/5">
              {featuredPost.image && (
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {featuredPost.date && (
                    <time>{format(new Date(featuredPost.date), 'MMMM d, yyyy')}</time>
                  )}
                  {featuredPost.author && (
                    <>
                      <span>•</span>
                      <span>{featuredPost.author}</span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-foreground group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {featuredPost.title}
                </h3>
                {featuredPost.description && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>
                )}
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredPost.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground border border-border text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="pt-4 flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                  <span>Read article</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* All Posts Grid - Masonry-inspired layout */}
      <section className="container px-4 pb-24 mx-auto">
        <h2 className="text-lg font-semibold text-muted-foreground mb-8 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-foreground" />
          All Articles
          <span className="ml-2 text-sm font-normal text-muted-foreground">({posts.length} posts)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post, index) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <article className="h-full flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-white to-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {post.image && (
                  <div className="aspect-[3/2] overflow-hidden rounded-xl mb-5">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    {post.date && (
                      <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                    )}
                    {post.author && (
                      <>
                        <span>•</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold leading-snug mb-3 text-foreground group-hover:text-white transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {post.description}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="border-border text-muted-foreground text-xs font-normal">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
