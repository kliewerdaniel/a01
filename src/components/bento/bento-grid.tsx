'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  Brain, 
  Database, 
  Code, 
  Globe, 
  Layers, 
  Terminal,
  ArrowRight,
  BookOpen,
  Sparkles,
  Cpu,
  Network,
  Bot,
  Gauge,
  LucideIcon
} from 'lucide-react';

// Bento grid item configuration
interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  tags?: string[];
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  gradient?: string;
  delay?: number;
}

const bentoItems: BentoItem[] = [
  {
    id: 'synthetic-intelligence',
    title: 'Synthetic Intelligence',
    description: 'Local-first, dynamic persona-driven knowledge synthesis system',
    icon: Brain,
    href: '/blog/2026-01-25-synthetic-intelligence',
    tags: ['AI', 'RAG', 'Local LLM'],
    size: 'large',
    gradient: 'from-purple-500/20 via-pink-500/20 to-red-500/20',
    delay: 0
  },
  {
    id: 'dynamic-persona',
    title: 'Dynamic Persona MoE RAG',
    description: 'Mixture of Experts architecture with persona modeling',
    icon: Layers,
    href: '/blog/2026-01-22-dynamic-persona-moe-rag',
    tags: ['MoE', 'RAG', 'Knowledge Graphs'],
    size: 'medium',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
    delay: 0.1
  },
  {
    id: 'mcp',
    title: 'MCP Integration',
    description: 'Model Context Protocol implementations with Ollama',
    icon: Network,
    href: '/blog/2025-03-24-model-context-protocol',
    tags: ['MCP', 'Ollama', 'Context'],
    size: 'medium',
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
    delay: 0.2
  },
  {
    id: 'local-llm',
    title: 'Local LLM Systems',
    description: 'Privacy-focused AI running entirely on personal hardware',
    icon: Cpu,
    href: '/blog/2025-11-08-local-llm-integration',
    tags: ['Ollama', 'llama.cpp', 'Privacy'],
    size: 'small',
    gradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    delay: 0.3
  },
  {
    id: 'knowledge-graphs',
    title: 'Knowledge Graphs',
    description: 'Graph-based data structures for AI reasoning',
    icon: Database,
    href: '/blog/2025-11-15-building-evaluating-local-research-assistant-graphrag-vero-eval',
    tags: ['Neo4j', 'GraphRAG'],
    size: 'small',
    gradient: 'from-indigo-500/20 via-violet-500/20 to-purple-500/20',
    delay: 0.4
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    description: 'Document-driven development with AI assistance',
    icon: Terminal,
    href: '/blog/2025-11-03-document-driven-development-nextjs-blog',
    tags: ['Next.js', 'AI', 'DDD'],
    size: 'wide',
    gradient: 'from-rose-500/20 via-pink-500/20 to-fuchsia-500/20',
    delay: 0.5
  },
  {
    id: 'blog-posts',
    title: 'Technical Blog',
    description: '100+ articles on AI, LLMs, and software development',
    icon: BookOpen,
    href: '/blog',
    tags: ['Articles', 'Tutorials'],
    size: 'tall',
    gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    delay: 0.6
  },
  {
    id: 'autonomous-agents',
    title: 'Autonomous Agents',
    description: 'Self-directed AI systems with tool use capabilities',
    icon: Bot,
    href: '/blog/2025-03-09-custom-agent',
    tags: ['Agents', 'Automation'],
    size: 'medium',
    gradient: 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
    delay: 0.7
  },
  {
    id: 'performance',
    title: 'Performance Metrics',
    description: 'Built with Next.js 16 for optimal speed and SEO',
    icon: Gauge,
    href: '/about',
    tags: ['Next.js 16', 'RSC'],
    size: 'small',
    gradient: 'from-slate-500/20 via-zinc-500/20 to-stone-500/20',
    delay: 0.8
  }
];

function BentoCard({ item }: { item: BentoItem }) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 row-span-2',
    wide: 'col-span-1 md:col-span-3 row-span-1',
    tall: 'col-span-1 md:col-span-1 row-span-2 lg:row-span-3'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: item.delay || 0 }}
      className={cn(
        'relative group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden',
        sizeClasses[item.size]
      )}
    >
      {/* Gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-70',
        item.gradient
      )} />
      
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'p-2.5 rounded-xl bg-foreground/10 border border-foreground/20',
            item.size === 'large' && 'p-3'
          )}>
            <item.icon className={cn(
              'w-5 h-5 text-foreground',
              item.size === 'large' && 'w-6 h-6'
            )} />
          </div>
          {item.href && (
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0" />
          )}
        </div>

        {/* Body */}
        <div className="flex-1">
          <h3 className={cn(
            'font-bold text-foreground mb-2 group-hover:text-white transition-colors',
            item.size === 'large' ? 'text-xl' : 'text-base'
          )}>
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {item.tags?.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-foreground/10 text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover link */}
        {item.href && (
          <Link 
            href={item.href}
            className="absolute inset-0 z-10"
          >
            <span className="sr-only">View {item.title}</span>
          </Link>
        )}
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors pointer-events-none" />
    </motion.div>
  );
}

export function BentoGrid({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]', className)}>
      {bentoItems.map(item => (
        <BentoCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// Stats component for dashboard
interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

const stats: Stat[] = [
  { label: 'Blog Posts', value: '110+', icon: BookOpen, trend: '+5 this month' },
  { label: 'AI Projects', value: '25+', icon: Brain, trend: 'Growing' },
  { label: 'Topics Covered', value: '50+', icon: Layers, trend: 'Expanding' },
  { label: 'Tech Stack', value: '15+', icon: Code, trend: 'Updated' }
];

export function DashboardStats({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          {stat.trend && (
            <div className="text-xs text-green-500/80 mt-1">{stat.trend}</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
