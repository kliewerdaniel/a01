'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  x?: number;
  y?: number;
  z?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
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

// Physics presets
const physicsPresets = {
  default: { strength: -30, distance: 100, charge: -100 },
  spread: { strength: -100, distance: 200, charge: -300 },
  cluster: { strength: -10, distance: 50, charge: -50 },
};

export default function KnowledgeGraph({ className, blogPosts }: KnowledgeGraphProps) {
  const graphRef = useRef<any>(null);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    blog: true,
    project: true,
    tag: true,
    category: true,
  });
  const [showControls, setShowControls] = useState(false);
  const [physicsSettings, setPhysicsSettings] = useState(physicsPresets.default);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);

  // Build complete graph data for reference
  const fullGraphData = useMemo(() => {
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

  // Filter graph data based on search and filters
  const graphData = useMemo(() => {
    const { nodes, links } = fullGraphData;
    
    // Filter nodes by type
    const filteredNodes = nodes.filter(node => filters[node.type]);
    
    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    const searchFilteredNodes = query 
      ? filteredNodes.filter(node => node.name.toLowerCase().includes(query))
      : filteredNodes;
    
    const nodeIds = new Set(searchFilteredNodes.map(n => n.id));
    
    // Filter links to only include connected filtered nodes
    const filteredLinks = links.filter(
      link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      }
    );

    return { nodes: searchFilteredNodes, links: filteredLinks };
  }, [fullGraphData, filters, searchQuery]);

  // Get related nodes for selected node
  const relatedNodes = useMemo(() => {
    if (!selectedNode) return [];
    
    const related: GraphNode[] = [];
    const relatedIds = new Set<string>();
    
    fullGraphData.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      if (sourceId === selectedNode.id || targetId === selectedNode.id) {
        const otherId = sourceId === selectedNode.id ? targetId : sourceId;
        const relatedNode = fullGraphData.nodes.find(n => n.id === otherId);
        if (relatedNode && !relatedIds.has(otherId)) {
          related.push(relatedNode);
          relatedIds.add(otherId);
        }
      }
    });
    
    return related;
  }, [selectedNode, fullGraphData]);

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
    
    // Highlight connected nodes
    const connectedIds = new Set<string>();
    fullGraphData.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      if (sourceId === graphNode.id) connectedIds.add(targetId);
      if (targetId === graphNode.id) connectedIds.add(sourceId);
    });
    setHighlightedNodes(connectedIds);
    
    if (graphNode.slug) {
      if (graphNode.slug.startsWith('http')) {
        window.open(graphNode.slug, '_blank');
      } else {
        router.push(graphNode.slug);
      }
    }
  }, [router, fullGraphData]);

  // Handle background click to deselect
  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightedNodes(new Set());
  }, []);

  // Focus on a specific node
  const focusOnNode = useCallback((nodeId: string) => {
    if (graphRef.current) {
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (node) {
        // Safely call centerAt if it exists
        if (typeof graphRef.current.centerAt === 'function' && node.x != null && node.y != null && node.z != null) {
          graphRef.current.centerAt(node.x, node.y, node.z, 1000);
        }
        // Safely call zoom if it exists
        if (typeof graphRef.current.zoom === 'function') {
          graphRef.current.zoom(3, 2000);
        }
      }
    }
  }, [graphData.nodes]);

  // Apply log-based compression to node positions to reduce outlier distances
  const compressNodePositions = useCallback(() => {
    if (!graphRef.current) return;
    const nodes = graphData.nodes as GraphNode[];
    if (nodes.length === 0) return;

    // Calculate median distance from origin to use as reference
    const distances = nodes
      .filter(n => n.x != null && n.y != null && n.z != null)
      .map(n => Math.sqrt((n.x! ** 2) + (n.y! ** 2) + (n.z! ** 2)));
    
    if (distances.length === 0) return;

    distances.sort((a, b) => a - b);
    const medianDist = distances[Math.floor(distances.length / 2)];
    
    // Scale factor: positions within ~2x median stay roughly linear,
    // positions beyond that get logarithmically compressed
    const threshold = medianDist * 2;

    nodes.forEach(node => {
      if (node.x == null || node.y == null || node.z == null) return;
      const dist = Math.sqrt(node.x ** 2 + node.y ** 2 + node.z ** 2);
      if (dist < 1) return; // avoid division by zero

      if (dist > threshold && threshold > 0) {
        // Logarithmic compression for outliers beyond threshold
        // newDist = threshold + log(1 + dist - threshold) * scaleFactor
        const scaleFactor = threshold / 2;
        const newDist = threshold + Math.log(1 + (dist - threshold) / scaleFactor) * scaleFactor;
        const ratio = newDist / dist;
        node.x *= ratio;
        node.y *= ratio;
        node.z *= ratio;
      }
    });
  }, [graphData.nodes]);

  // Reset view
  const resetView = useCallback(() => {
    if (graphRef.current) {
      compressNodePositions();
      if (typeof graphRef.current.zoomToFit === 'function') {
        graphRef.current.zoomToFit(400, 50);
      }
    }
    setSelectedNode(null);
    setHighlightedNodes(new Set());
    setSearchQuery('');
  }, [compressNodePositions]);

  // Apply physics preset
  const applyPhysicsPreset = useCallback((preset: keyof typeof physicsPresets) => {
    setPhysicsSettings(physicsPresets[preset]);
    if (graphRef.current) {
      graphRef.current.d3ReheatSimulation();
    }
  }, []);

  // Toggle filter
  const toggleFilter = useCallback((type: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  // Node color with highlight effect
  const getNodeColor = useCallback((node: any) => {
    if (highlightedNodes.has(node.id) || !highlightedNodes.size) {
      return node.color || typeColors.blog;
    }
    return '#333333';
  }, [highlightedNodes]);

  // Node size with highlight effect
  const getNodeVal = useCallback((node: any) => {
    const baseVal = node.val || 10;
    if (selectedNode?.id === node.id) return baseVal * 1.5;
    if (highlightedNodes.has(node.id)) return baseVal * 1.2;
    return baseVal;
  }, [selectedNode, highlightedNodes]);

  const data = graphData;

  return (
    <div className={cn('relative', className)} id="knowledge-graph-container" onClick={handleBackgroundClick}>
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0a0a0a"
        nodeLabel="name"
        nodeColor={getNodeColor}
        nodeVal={getNodeVal}
        onNodeClick={handleNodeClick}
        onNodeHover={(node: any) => setHoveredNode(node as GraphNode)}
        linkColor={(link: any) => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          if (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)) {
            return 'rgba(255, 255, 255, 0.6)';
          }
          return 'rgba(255, 255, 255, 0.1)';
        }}
        linkWidth={(link: any) => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          if (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)) {
            return 2;
          }
          return 1;
        }}
        linkDirectionalParticles={highlightedNodes.size > 0 ? 4 : 2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={highlightedNodes.size > 0 ? 3 : 2}
        linkDirectionalParticleColor={() => highlightedNodes.size > 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'}
        cooldownTicks={200}
        onEngineStop={() => {
          if (graphRef.current) {
            // Compress outlier positions using log scaling before fitting view
            compressNodePositions();
            if (typeof graphRef.current.zoomToFit === 'function') {
              graphRef.current.zoomToFit(500, 50);
            }
          }
        }}
        d3VelocityDecay={0.2}
        d3AlphaDecay={0.02}
      />

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 bg-background/90 backdrop-blur-sm border-border text-xs pr-8"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border-border text-xs"
            onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); }}
          >
            {showSearch ? 'Hide' : 'Search'}
          </Button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border-border text-xs"
            onClick={(e) => { e.stopPropagation(); resetView(); }}
          >
            Reset View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm border-border text-xs"
            onClick={(e) => { e.stopPropagation(); setShowControls(!showControls); }}
          >
            ⚙️
          </Button>
        </div>
      </div>

      {/* Physics Controls Panel */}
      {showControls && (
        <div 
          className="absolute top-20 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-sm font-semibold mb-3 text-foreground">Physics Controls</h3>
          
          <div className="space-y-3">
            <div className="flex gap-1">
              {(['default', 'spread', 'cluster'] as const).map((preset) => (
                <Button
                  key={preset}
                  variant={physicsSettings === physicsPresets[preset] ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => applyPhysicsPreset(preset)}
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button
              variant={isPaused ? 'default' : 'outline'}
              size="sm"
              className="w-full text-xs"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </Button>
          </div>

          <h4 className="text-xs font-semibold mt-4 mb-2 text-foreground">Filters</h4>
          <div className="space-y-2">
            {Object.entries(filters).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleFilter(key as keyof typeof filters)}
                  className="rounded border-border"
                />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[key as keyof typeof typeColors] }} />
                <span className="text-xs text-muted-foreground capitalize">{key}s</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-20 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4">
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

      {/* Hover Info Panel */}
      {hoveredNode && !selectedNode && (
        <div 
          className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: hoveredNode.color,
                color: hoveredNode.color,
              }}
            >
              {hoveredNode.type}
            </Badge>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{hoveredNode.name}</h4>
          {hoveredNode.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {hoveredNode.description}
            </p>
          )}
          {hoveredNode.slug && (
            <p className="text-xs text-muted-foreground">
              Click to {hoveredNode.slug?.startsWith('http') ? 'open GitHub' : 'view post'}
            </p>
          )}
        </div>
      )}

      {/* Selected Node Detail Panel */}
      {selectedNode && (
        <div 
          className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 max-w-sm max-h-[300px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: selectedNode.color,
                color: selectedNode.color,
              }}
            >
              {selectedNode.type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => { setSelectedNode(null); setHighlightedNodes(new Set()); }}
            >
              ×
            </Button>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{selectedNode.name}</h4>
          {selectedNode.description && (
            <p className="text-xs text-muted-foreground mb-3">
              {selectedNode.description}
            </p>
          )}
          
          {/* Related Content */}
          {relatedNodes.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                Connected ({relatedNodes.length})
              </h5>
              <div className="flex flex-wrap gap-1">
                {relatedNodes.slice(0, 8).map((node) => (
                  <Badge
                    key={node.id}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-accent"
                    style={{ borderColor: node.color, color: node.color }}
                    onClick={() => focusOnNode(node.id)}
                  >
                    {node.name}
                  </Badge>
                ))}
                {relatedNodes.length > 8 && (
                  <Badge variant="outline" className="text-xs">
                    +{relatedNodes.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex-1"
              onClick={() => focusOnNode(selectedNode.id)}
            >
              Focus
            </Button>
            {selectedNode.slug && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs flex-1"
                onClick={() => {
                  if (selectedNode.slug?.startsWith('http')) {
                    window.open(selectedNode.slug, '_blank');
                  } else {
                    router.push(selectedNode.slug!);
                  }
                }}
              >
                {selectedNode.slug?.startsWith('http') ? 'Open GitHub' : 'View Post'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{graphData.nodes.length} nodes</span>
          <span>•</span>
          <span>{graphData.links.length} connections</span>
          {searchQuery && (
            <>
              <span>•</span>
              <span className="text-foreground">Filtered</span>
            </>
          )}
        </div>
        <p className="mt-1">Click to navigate • Scroll to zoom • Drag to rotate</p>
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && graphData.nodes.length > 0 && (
        <div 
          className="absolute top-16 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 w-64 max-h-48 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs text-muted-foreground mb-2">
            {graphData.nodes.length} results
          </p>
          {graphData.nodes.slice(0, 10).map((node) => (
            <button
              key={node.id}
              className="w-full text-left px-2 py-1.5 text-xs hover:bg-accent rounded flex items-center gap-2"
              onClick={() => focusOnNode(node.id)}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: node.color }}
              />
              <span className="truncate">{node.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
