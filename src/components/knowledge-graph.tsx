'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dynamically import ForceGraph3D to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-background">
      <div className="text-muted-foreground">Loading knowledge graph...</div>
    </div>
  ),
});

// Types - matching the BlogPost from lib/blog.ts
interface BlogPostData {
  slug: string;
  title: string;
  date: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  author?: string;
  image?: string;
}

interface GraphNode {
  id: string;
  name: string;
  val: number;
  type: 'blog' | 'project' | 'tag' | 'category';
  color: string;
  slug?: string;
  description?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

interface KnowledgeGraphProps {
  className?: string;
  blogPosts: BlogPostData[];
}

// Projects data - from projects page
const projects = [
  {
    title: 'synt - Synthetic Intelligence',
    slug: 'synt',
    description: 'A revolutionary, air-gapped Local-First Dynamic Persona Intelligence System',
    tags: ['AI', 'Local LLM', 'Privacy', 'Persona System', 'Knowledge Synthesis'],
  },
  {
    title: 'Dynamic Persona MoE RAG',
    slug: 'dynamic_persona_moe_rag',
    description: 'A dynamic graph-based Mixture-of-Experts RAG system',
    tags: ['RAG', 'Mixture of Experts', 'Ollama', 'Python', 'Knowledge Graph'],
  },
  {
    title: 'StratAgent',
    slug: 'stratagent',
    description: 'A collaborative AI development environment',
    tags: ['AI Agents', 'Development Workflow', 'Multi-Agent', 'Code Generation'],
  },
  {
    title: 'SpecGen',
    slug: 'specgen',
    description: 'Transform natural language specifications into production-ready code',
    tags: ['Code Generation', 'AI Agents', 'Development Tools', 'Automation'],
  },
  {
    title: 'ACE-Step',
    slug: 'ace-step',
    description: 'Music Generation Foundation Model',
    tags: ['Music AI', 'Deep Learning', 'Audio Generation', 'Research'],
  },
  {
    title: 'AutoBlog01',
    slug: 'autoblog01',
    description: 'Next.js blogging platform with AI-driven content generation',
    tags: ['Next.js', 'RAG', 'AI Content', 'SEO', 'RSS'],
  },
  {
    title: 'Orthos',
    slug: 'orthos',
    description: 'Locally Sovereign, Replayable, Graph-Executed Cognitive System',
    tags: ['Local AI', 'Graph Execution', 'Privacy', 'Cognitive System', 'Knowledge Graph'],
  },
  {
    title: 'MCBot01 - GraphRAG',
    slug: 'mcbot01',
    description: 'GraphRAG Research Assistant with MCP integration',
    tags: ['GraphRAG', 'Research', 'MCP', 'Knowledge Graph', 'Document Analysis'],
  },
  {
    title: 'BotChat',
    slug: 'botchat',
    description: 'Full-stack AI chat application',
    tags: ['Chatbot', 'Next.js', 'MCP', 'Gemma', 'Local LLM'],
  },
  {
    title: 'Next.js Boilerplate',
    slug: 'next',
    description: 'Production-ready Next.js boilerplate',
    tags: ['Next.js', 'Boilerplate', 'TypeScript', 'React', 'Template'],
  },
  {
    title: 'Synth01 - News to Audio',
    slug: 'synth01',
    description: 'Privacy-focused RSS to audio broadcasts using local LLMs',
    tags: ['Local LLM', 'Privacy', 'Audio Generation', 'RSS', 'TTS'],
  },
  {
    title: 'MindMap AI',
    slug: 'mindmap03',
    description: 'Personal knowledge management with mind maps',
    tags: ['Knowledge Graph', 'Mind Map', 'Local LLM', 'Vector DB', 'Personal Knowledge'],
  },
  {
    title: 'SteinBot',
    slug: 'steinbot',
    description: 'AI research assistant for financial data analysis',
    tags: ['Finance AI', 'Research', 'Chatbot', 'Document Analysis', 'Data Analysis'],
  },
  {
    title: 'GraphRAGEval',
    slug: 'graphrageval',
    description: 'Evaluation framework for GraphRAG systems',
    tags: ['GraphRAG', 'Evaluation', 'RAG', 'Research', 'Benchmarking'],
  },
  {
    title: 'PersonaForge',
    slug: 'personaforge04',
    description: 'UI for creating and managing AI personas',
    tags: ['AI Personas', 'UI', 'TypeScript', 'React', 'Persona Engineering'],
  },
];

// Color scheme for different node types
const typeColors = {
  blog: '#3b82f6',
  project: '#8b5cf6',
  tag: '#10b981',
  category: '#f59e0b',
};

export default function KnowledgeGraph({ className, blogPosts }: KnowledgeGraphProps) {
  const graphRef = useRef<any>(null);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Build graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeIds = new Set<string>();

    // Add blog posts as nodes
    blogPosts.forEach((post) => {
      const id = `blog-${post.slug}`;
      if (!nodeIds.has(id)) {
        nodes.push({
          id,
          name: post.title || post.slug,
          val: 15,
          type: 'blog',
          color: typeColors.blog,
          slug: `/blog/${post.slug}`,
          description: post.description,
        });
        nodeIds.add(id);
      }

      // Link to tags
      const postTags = post.tags || [];
      postTags.forEach((tag: string) => {
        const tagId = `tag-${tag.toLowerCase()}`;
        if (!nodeIds.has(tagId)) {
          nodes.push({
            id: tagId,
            name: tag,
            val: 8,
            type: 'tag',
            color: typeColors.tag,
          });
          nodeIds.add(tagId);
        }
        links.push({ source: id, target: tagId, type: 'has_tag' });
      });

      // Link to categories
      const postCategories = post.categories || [];
      postCategories.forEach((cat: string) => {
        const catId = `category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        if (!nodeIds.has(catId)) {
          nodes.push({
            id: catId,
            name: cat,
            val: 10,
            type: 'category',
            color: typeColors.category,
          });
          nodeIds.add(catId);
        }
        links.push({ source: id, target: catId, type: 'in_category' });
      });
    });

    // Add projects as nodes
    projects.forEach((project) => {
      const id = `project-${project.slug}`;
      if (!nodeIds.has(id)) {
        nodes.push({
          id,
          name: project.title,
          val: 12,
          type: 'project',
          color: typeColors.project,
          slug: project.slug.startsWith('http') ? project.slug : `https://github.com/kliewerdaniel/${project.slug}`,
          description: project.description,
        });
        nodeIds.add(id);
      }

      // Link to tags
      project.tags.forEach((tag) => {
        const tagId = `tag-${tag.toLowerCase()}`;
        if (!nodeIds.has(tagId)) {
          nodes.push({
            id: tagId,
            name: tag,
            val: 8,
            type: 'tag',
            color: typeColors.tag,
          });
          nodeIds.add(tagId);
        }
        links.push({ source: id, target: tagId, type: 'has_tag' });
      });
    });

    return { nodes, links };
  }, [blogPosts]);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('knowledge-graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    const graphNode: GraphNode = node;
    setSelectedNode(graphNode);
    if (graphNode.slug) {
      if (graphNode.slug.startsWith('http')) {
        window.open(graphNode.slug, '_blank');
      } else {
        router.push(graphNode.slug);
      }
    }
  }, [router]);

  const data = graphData;

  return (
    <div className={cn('relative', className)} id="knowledge-graph-container">
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0a"
        nodeLabel="name"
        nodeColor={(node: any) => node.color || typeColors.blog}
        nodeVal="val"
        onNodeClick={handleNodeClick}
        onNodeHover={(node: any) => setHoveredNode(node as GraphNode)}
        linkColor={() => 'rgba(255, 255, 255, 0.15)'}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => 'rgba(255, 255, 255, 0.5)'}
        cooldownTicks={100}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400);
          }
        }}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3 text-foreground">Legend</h3>
        <div className="space-y-2">
          {[
            { type: 'blog', label: `Blog Posts (${blogPosts.length})`, color: typeColors.blog },
            { type: 'project', label: `Projects (${projects.length})`, color: typeColors.project },
            { type: 'tag', label: 'Tags', color: typeColors.tag },
            { type: 'category', label: 'Categories', color: typeColors.category },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover/Selected Info Panel */}
      {(hoveredNode || selectedNode) && (
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: (hoveredNode || selectedNode)?.color,
                color: (hoveredNode || selectedNode)?.color,
              }}
            >
              {(hoveredNode || selectedNode)?.type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setHoveredNode(null);
                setSelectedNode(null);
              }}
            >
              ×
            </Button>
          </div>
          <h4 className="font-semibold text-foreground mb-1">
            {(hoveredNode || selectedNode)?.name}
          </h4>
          {(hoveredNode || selectedNode)?.description && (
            <p className="text-xs text-muted-foreground mb-2">
              {(hoveredNode || selectedNode)?.description}
            </p>
          )}
          {(hoveredNode || selectedNode)?.slug && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const slug = (hoveredNode || selectedNode)?.slug;
                if (slug) {
                  if (slug.startsWith('http')) {
                    window.open(slug, '_blank');
                  } else {
                    router.push(slug);
                  }
                }
              }}
            >
              {((hoveredNode || selectedNode)?.slug)?.startsWith('http') ? 'Open GitHub' : 'View Post'}
            </Button>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        <p>Click to navigate • Scroll to zoom • Drag to rotate</p>
      </div>
    </div>
  );
}
