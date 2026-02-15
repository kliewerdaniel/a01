'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Code, 
  Brain, 
  Database, 
  Search, 
  X, 
  Calendar, 
  Tag,
  Filter,
  Sparkles,
  ChevronDown,
  BookOpen,
  Zap,
  Globe,
  Layers,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/lib/blog';

interface HomeClientProps {
  posts: BlogPost[];
}

interface FeaturedProject {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  tags: string[];
}

// Featured projects to showcase
const featuredProjects: FeaturedProject[] = [
  {
    title: 'Synthetic Intelligence',
    description: 'Local-first, dynamic persona-driven knowledge synthesis system',
    icon: Brain,
    href: '/blog/2026-01-25-synthetic-intelligence',
    tags: ['AI', 'RAG', 'Local LLM', 'Persona Engineering']
  },
  {
    title: 'Dynamic Persona MoE RAG',
    description: 'Mixture of Experts RAG architecture with dynamic persona modeling',
    icon: Layers,
    href: '/blog/2026-01-22-dynamic-persona-moe-rag',
    tags: ['Mixture of Experts', 'Knowledge Graphs', 'RAG']
  },
  {
    title: 'MCP Integration',
    description: 'Model Context Protocol implementations with Ollama',
    icon: Zap,
    href: '/blog/2025-03-24-model-context-protocol',
    tags: ['MCP', 'Ollama', 'Context Management']
  },
  {
    title: 'Vibe Coding Guide',
    description: 'Document-driven development with AI assistance',
    icon: Terminal,
    href: '/blog/2025-11-03-document-driven-development-nextjs-blog',
    tags: ['Vibe Coding', 'Next.js', 'AI Development']
  }
];

// Extract tags and categories from posts
function extractTagsAndCategories(posts: BlogPost[]) {
  const allTags = new Set<string>();
  const allCategories = new Set<string>();
  
  posts.forEach(post => {
    post.tags?.forEach(tag => allTags.add(tag));
    post.categories?.forEach(cat => allCategories.add(cat));
  });
  
  return {
    tags: Array.from(allTags).sort(),
    categories: Array.from(allCategories).sort()
  };
}

// Format date
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Default fallback image for posts without images
const defaultImage = '/images/101801.png';

export default function HomeClient({ posts: blogPosts }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { tags: allTags, categories: allCategories } = useMemo(() => 
    extractTagsAndCategories(blogPosts), 
    [blogPosts]
  );

  // Filter posts based on search, tags, and categories
  const filteredPosts = useMemo(() => {
    let results = blogPosts;

    // Search filter (searches title, description, tags)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        post.categories?.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      results = results.filter(post => 
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(post => 
        selectedCategories.some(cat => post.categories?.includes(cat))
      );
    }

    return results;
  }, [searchQuery, selectedTags, selectedCategories, blogPosts]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedCategories([]);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - High Contrast Black/White */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Simple dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#0a0a0a]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container relative z-10 px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-foreground text-sm font-medium mb-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                Machine Learning Enthusiast
              </motion.span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-wider mb-6 text-foreground"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Daniel Kliewer
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Software Engineer & AI Practitioner based in Austin, Texas building with LLMs, autonomous agents, and local-first AI systems. 
              Passionate about data sovereignty, privacy-focused AI, and building intelligence systems that run entirely on personal hardware.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/projects">
                <Button 
                  size="lg" 
                  className="gap-2 bg-foreground text-background hover:bg-white/90 border border-foreground font-semibold"
                >
                  <Code className="w-4 h-4" />
                  View Projects
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 border-border text-foreground hover:border-white hover:text-white hover:bg-white/5"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Blog
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  About Me
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-wide" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Featured Projects</h2>
                <p className="text-muted-foreground mt-2">Highlights from my work in AI & Software Development</p>
              </div>
              <Link href="/projects">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={project.href}>
                    <Card className="h-full bg-card border border-border hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 group cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <project.icon className="h-10 w-10 text-foreground group-hover:scale-110 transition-transform duration-300" />
                          <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardTitle className="group-hover:text-white transition-colors mt-4 text-foreground">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-muted-foreground text-base">
                          {project.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground border border-border text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section with Advanced Search & Filter */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-wide" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Blog Posts</h2>
                <p className="text-muted-foreground mt-2">
                  Thoughts on AI, machine learning, and software development
                </p>
              </div>
              <Link href="/blog">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="space-y-4 mb-8">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search posts by title, description, tags... (⌘K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="pl-10 pr-10 h-12 text-base bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-white focus:ring-white/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(selectedTags.length > 0 || selectedCategories.length > 0) && (
                    <Badge variant="secondary" className="ml-1 bg-white/10 text-foreground">
                      {selectedTags.length + selectedCategories.length}
                    </Badge>
                  )}
                </Button>
                
                {(selectedTags.length > 0 || selectedCategories.length > 0 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{filteredPosts.length} posts</span>
                </div>
              </div>

              {/* Expanded Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4 border-t border-border">
                      {/* Categories */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
                          <Database className="w-4 h-4" />
                          Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {allCategories.map(category => (
                            <Badge
                              key={category}
                              variant={selectedCategories.includes(category) ? 'default' : 'secondary'}
                              className={selectedCategories.includes(category) 
                                ? "bg-foreground text-background hover:bg-white/80" 
                                : "bg-background text-muted-foreground border border-border hover:bg-white/10 cursor-pointer transition-colors"
                              }
                              onClick={() => toggleCategory(category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
                          <Tag className="w-4 h-4" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                          {allTags.map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                              className={selectedTags.includes(tag)
                                ? "bg-foreground text-background hover:bg-white/80 cursor-pointer"
                                : "border-border text-muted-foreground hover:border-white hover:text-white cursor-pointer transition-colors"
                              }
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filters Display */}
              {(selectedTags.length > 0 || selectedCategories.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedCategories.map(category => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="gap-1 cursor-pointer bg-white/10 text-foreground border-0"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="gap-1 cursor-pointer border-white text-white"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Posts Grid with Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPosts.slice(0, 6).map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="h-full bg-card border border-border hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 group cursor-pointer">
                        {/* Post Image */}
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={post.image || defaultImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.date)}
                          </div>
                          <CardTitle className="group-hover:text-white transition-colors line-clamp-2 text-foreground">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-3 text-base text-muted-foreground">
                            {post.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.slice(0, 4).map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground border border-border text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" onClick={clearFilters} className="border-border text-muted-foreground hover:border-white hover:text-white">
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick About Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground tracking-wide" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>About Me</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I'm Daniel Kliewer, a software engineer and AI practitioner based in Austin, Texas. 
                    I build practical applications that leverage modern AI capabilities—from RAG-powered 
                    research assistants to privacy-focused local AI systems that run entirely on personal hardware.
                  </p>
                  <p>
                    My work sits at the intersection of AI engineering and full-stack development. 
                    I primarily work with Python and TypeScript, building systems that combine large language 
                    models with knowledge graphs, vector databases, and autonomous agents.
                  </p>
                  <p>
                    I'm passionate about <strong className="text-foreground">data sovereignty</strong>—the idea 
                    that your data should stay yours. That's why I focus on local-first AI systems that don't 
                    require sending your information to third-party APIs.
                  </p>
                </div>
                <div className="mt-6">
                  <Link href="/about">
                    <Button variant="outline" className="gap-2 border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5">
                      Learn More About Me
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      What I'm Working On
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-foreground mt-2" />
                      <p className="text-muted-foreground text-sm">Building sovereign synthetic intelligence systems with Dynamic Persona MoE RAG architecture</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-foreground mt-2" />
                      <p className="text-muted-foreground text-sm">Experimenting with local LLM deployment using Ollama and llama.cpp</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-foreground mt-2" />
                      <p className="text-muted-foreground text-sm">Developing multi-agent systems where specialized AI personas collaborate</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-foreground mt-2" />
                      <p className="text-muted-foreground text-sm">Exploring document-driven development and "vibe coding" methodologies</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Location & Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground text-sm">
                    <p>📍 Austin, Texas</p>
                    <p>🕐 Currently available for freelance projects and consulting</p>
                    <p>💼 Open to full-time opportunities in AI/ML</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground tracking-wide" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Technical Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Brain, title: 'AI & ML', items: ['LLMs', 'RAG', 'Autonomous Agents', 'Local LLM (Ollama)'] },
                { icon: Database, title: 'Data Engineering', items: ['Knowledge Graphs', 'Vector DBs', 'Data Pipelines', 'GraphRAG'] },
                { icon: Code, title: 'Full-Stack', items: ['Next.js', 'React', 'Python', 'TypeScript', 'FastAPI'] },
                { icon: Globe, title: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Cloud Deploy', 'MCP'] },
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-card border border-border hover:border-white/30 transition-all duration-300">
                    <CardHeader>
                      <category.icon className="h-8 w-8 mb-2 text-foreground" />
                      <CardTitle className="text-foreground">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map(item => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-foreground" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - High Contrast Black/White */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Let's Build Something Amazing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              I'm always interested in discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="default" size="lg" className="gap-2 bg-foreground text-background hover:bg-white/90 font-semibold">
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                  View Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
