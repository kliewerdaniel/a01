import { getBlogPosts } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import KnowledgeGraph from '@/components/knowledge-graph';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const posts = getBlogPosts();

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
        
        <div className="container px-4 py-16 mx-auto relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 text-sm px-4 py-1 border-white/20 text-foreground">
              Knowledge Graph
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-6 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Explore the Connections
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              An interactive 3D knowledge graph showing how my books, projects, and blog posts interconnect. 
              Navigate through topics, discover related content, and explore the relationships between ideas.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge variant="outline" className="border-white/20 text-foreground">
                Interactive Graph
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

      {/* Graph View */}
      <section className="container px-4 pb-16 mx-auto">
        <div className="rounded-2xl overflow-hidden border border-border bg-[#0a0a0a]">
          <KnowledgeGraph className="h-[600px]" blogPosts={posts} />
        </div>
      </section>
    </div>
  );
}
