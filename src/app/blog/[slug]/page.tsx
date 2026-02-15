import { getBlogPost, getAllBlogSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { CodeBlock } from '@/components/code-block';
import { ScrollToTop } from '@/components/scroll-to-top';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: post.og ? {
      title: post.og.title || post.title,
      description: post.og.description || post.description,
      images: post.og.image ? [post.og.image] : [],
      url: post.og.url,
      type: post.og.type as 'article' | 'website' | undefined,
    } : undefined,
    twitter: post.twitter ? {
      card: post.twitter.card as 'summary' | 'summary_large_image' | undefined,
      title: post.twitter.title || post.title,
      description: post.twitter.description || post.description,
      images: post.twitter.image ? [post.twitter.image] : undefined,
    } : undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Parse date - handle multiple formats
  let formattedDate = post.date;
  try {
    if (post.date) {
      // Try to parse the date - handle formats like "2024-10-04 07:40:44 -0500" or "02-13-2026"
      let dateStr = post.date;
      // Convert MM-DD-YYYY to YYYY-MM-DD if needed
      if (/^\d{2}-\d{2}-\d{4}/.test(dateStr)) {
        dateStr = dateStr.replace(/^(\d{2})-(\d{2})-(\d{4})/, '$3-$1-$2');
      }
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = format(parsedDate, 'MMMM d, yyyy');
      }
    }
  } catch {
    // Keep original if parsing fails
  }

  // Filter out the first image from content if it matches the featured image
  let content = post.content;
  if (post.image) {
    // Match the first markdown image that matches the featured image
    const imageRegex = new RegExp(`^!\\[([^\\]]*)\\]\\(${post.image.replace('/', '\\/')}\\)\\n?`, 'm');
    content = content.replace(imageRegex, '');
  }

  return (
    <article className="container px-4 py-16 mx-auto max-w-4xl min-h-screen bg-background">
      {/* Header */}
      <header className="mb-12">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-wide"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
          {post.date && (
            <time dateTime={post.date}>{formattedDate}</time>
          )}
          {post.author && (
            <span>by {post.author}</span>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-secondary text-muted-foreground border border-border"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-12">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Content - High Contrast Black/White */}
      <div className="prose prose-lg dark:prose-invert max-w-none 
        prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-wide
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-a:text-foreground prose-a:underline hover:prose-a:opacity-70
        prose-strong:text-foreground
        prose-code:text-foreground prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-secondary prose-pre:border prose-pre:border-border
        prose-blockquote:border-l-foreground prose-blockquote:text-muted-foreground
        prose-li:text-muted-foreground
        prose-img:rounded-lg
        prose-pre:relative prose-pre:overflow-hidden
      ">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              
              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
              
              return (
                <CodeBlock className={className}>
                  {children}
                </CodeBlock>
              );
            },
            pre({ children }) {
              return (
                <pre className="bg-secondary border border-border rounded-lg p-4 overflow-x-auto">
                  {children}
                </pre>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      <ScrollToTop />
    </article>
  );
}
