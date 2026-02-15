'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Code, 
  ChevronRight, 
  Copy, 
  Check,
  ExternalLink,
  Terminal,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ============== Mermaid Diagram Component ==============

function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function renderMermaid() {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = await import('mermaid');
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'monospace'
        });
        
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.default.render(id, chart);
        setSvg(svg);
        setIsLoading(false);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram');
        setIsLoading(false);
      }
    }

    if (chart) {
      renderMermaid();
    }
  }, [chart]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-secondary/30 rounded-lg">
        <div className="animate-spin w-6 h-6 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
        {error}
      </div>
    );
  }

  return (
    <div 
      className="overflow-x-auto p-4 bg-secondary/30 rounded-lg"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}

// ============== Code Block Component ==============

function CodeBlock({ 
  code, 
  language = 'typescript',
  showLineNumbers = true 
}: { 
  code: string; 
  language?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
          className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="select-none w-8 text-right pr-4 text-muted-foreground/50 text-xs">
                  {i + 1}
                </span>
              )}
              <span className="flex-1">{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// ============== Callout Component ==============

function Callout({ 
  type = 'info', 
  title, 
  children 
}: { 
  type?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const icons = {
    info: Info,
    warning: AlertCircle,
    tip: Lightbulb,
    danger: AlertCircle
  };
  
  const colors = {
    info: 'border-blue-500/50 bg-blue-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    tip: 'border-green-500/50 bg-green-500/10',
    danger: 'border-red-500/50 bg-red-500/10'
  };

  const Icon = icons[type];

  return (
    <div className={cn('border-l-4 p-4 rounded-r-lg', colors[type])}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ============== Main Documentation Component ==============

interface DocSection {
  id: string;
  title: string;
  content: string;
}

interface DocSpec {
  title: string;
  description: string;
  author?: string;
  date?: string;
  version?: string;
  tags?: string[];
  sections: DocSection[];
}

interface MarkdownDocsProps {
  spec: DocSpec;
  className?: string;
}

export function MarkdownDocs({ spec, className }: MarkdownDocsProps) {
  const [activeSection, setActiveSection] = useState(spec.sections[0]?.id);

  // Extract headings from markdown for table of contents
  const tableOfContents = spec.sections.map(section => {
    const headingMatch = section.content.match(/^#\s+(.+)$/m);
    const headings = section.content.match(/^##\s+(.+)$/gm) || [];
    return {
      id: section.id,
      title: headingMatch ? headingMatch[1] : section.title,
      headings: headings.map(h => h.replace(/^##\s+/, ''))
    };
  });

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-4 gap-6', className)}>
      {/* Table of Contents */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <nav className="space-y-1">
                {tableOfContents.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                      activeSection === item.id
                        ? 'bg-foreground/10 text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    )}
                  >
                    <span className="mr-2">{index + 1}.</span>
                    {item.title}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Meta info */}
          <Card className="mt-4 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-4 space-y-3">
              {spec.author && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Author:</span>{' '}
                  <span className="text-foreground">{spec.author}</span>
                </div>
              )}
              {spec.date && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Date:</span>{' '}
                  <span className="text-foreground">{spec.date}</span>
                </div>
              )}
              {spec.version && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Version:</span>{' '}
                  <Badge variant="secondary">{spec.version}</Badge>
                </div>
              )}
              {spec.tags && (
                <div className="flex flex-wrap gap-1">
                  {spec.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{spec.title}</h1>
          <p className="text-muted-foreground text-lg">{spec.description}</p>
        </div>

        {/* Sections */}
        {spec.sections.map(section => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="scroll-mt-24"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeSlug]}
                    components={{
                      // Custom code block
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        
                        if (isInline) {
                          return (
                            <code className="px-1.5 py-0.5 bg-secondary rounded text-sm" {...props}>
                              {children}
                            </code>
                          );
                        }
                        
                        return (
                          <CodeBlock
                            code={String(children).replace(/\n$/, '')}
                            language={match[1]}
                          />
                        );
                      },
                      // Custom pre
                      pre({ children }) {
                        return <>{children}</>;
                      },
                      // Custom links
                      a({ href, children }) {
                        return (
                          <a 
                            href={href} 
                            className="text-foreground underline underline-offset-4 hover:text-foreground/80 inline-flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        );
                      },
                      // Custom headings
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-foreground mt-8 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>
                      ),
                      // Custom paragraphs
                      p: ({ children }) => (
                        <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
                      ),
                      // Custom lists
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-muted-foreground">{children}</li>
                      ),
                      // Custom blockquote
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        ))}
      </main>
    </div>
  );
}

// ============== Utility: Extract Mermaid from markdown ==============

export function extractMermaidDiagrams(markdown: string): string[] {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  const diagrams: string[] = [];
  let match;
  
  while ((match = mermaidRegex.exec(markdown)) !== null) {
    diagrams.push(match[1]);
  }
  
  return diagrams;
}

// ============== Interactive Example Component ==============

interface InteractiveExampleProps {
  title: string;
  description: string;
  code: string;
  language?: string;
}

export function InteractiveExample({ 
  title, 
  description, 
  code,
  language = 'typescript'
}: InteractiveExampleProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 my-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="code">
          <TabsList className="mb-4">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="code">
            <CodeBlock code={code} language={language} />
          </TabsContent>
          <TabsContent value="preview">
            <div className="p-8 bg-secondary/30 rounded-lg text-center text-muted-foreground">
              Preview would render here in a live environment
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
