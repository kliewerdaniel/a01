/**
 * AI Tools for Agentic Workflows
 * Implements tool calling capabilities for the AI assistant
 */

import { getBlogPosts, getBlogPost } from '@/lib/blog';
import { personas, defaultAgent, type Persona, type Agent } from './types';

// ============== Tool Definitions ==============

export interface AITool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// Available tools for the AI to use
export const availableTools: AITool[] = [
  {
    name: 'search_documentation',
    description: 'Search through blog posts and project documentation by keywords or topics',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query or keywords' },
        limit: { type: 'number', description: 'Maximum number of results (default: 5)' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_blog_post',
    description: 'Get the full content of a specific blog post by its slug',
    parameters: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The blog post slug' }
      },
      required: ['slug']
    }
  },
  {
    name: 'list_personas',
    description: 'List available AI personas that can be used to tailor responses',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_site_info',
    description: 'Get information about this portfolio site, its architecture, and the owner',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'list_skills',
    description: 'List all technical skills and areas of expertise',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_featured_projects',
    description: 'Get information about featured projects on the site',
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

// ============== Tool Implementations ==============

export async function executeTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case 'search_documentation':
      return await searchDocumentation(args.query as string, args.limit as number);
    case 'get_blog_post':
      return await getBlogPostContent(args.slug as string);
    case 'list_personas':
      return listPersonas();
    case 'get_site_info':
      return getSiteInfo();
    case 'list_skills':
      return listSkills();
    case 'get_featured_projects':
      return getFeaturedProjects();
    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}

async function searchDocumentation(query: string, limit = 5): Promise<string> {
  const posts = getBlogPosts();
  const queryLower = query.toLowerCase();
  
  // Score posts by relevance
  const scored = posts.map(post => {
    let score = 0;
    const titleLower = post.title.toLowerCase();
    const descLower = (post.description || '').toLowerCase();
    const tagsLower = (post.tags || []).join(' ').toLowerCase();
    const categoriesLower = (post.categories || []).join(' ').toLowerCase();
    
    // Title matches are weighted highest
    if (titleLower.includes(queryLower)) score += 10;
    // Description matches
    if (descLower.includes(queryLower)) score += 5;
    // Tag matches
    if (tagsLower.includes(queryLower)) score += 3;
    // Category matches
    if (categoriesLower.includes(queryLower)) score += 2;
    
    return { post, score };
  });
  
  // Sort by score and take top results
  const results = scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  if (results.length === 0) {
    return JSON.stringify({ 
      message: 'No matching documentation found. Try different keywords.',
      query 
    });
  }
  
  return JSON.stringify({
    query,
    count: results.length,
    results: results.map(({ post, score }) => ({
      title: post.title,
      slug: post.slug,
      description: post.description,
      date: post.date,
      tags: post.tags?.slice(0, 5),
      relevance_score: score,
      url: `/blog/${post.slug}`
    }))
  });
}

async function getBlogPostContent(slug: string): Promise<string> {
  const post = getBlogPost(slug);
  
  if (!post) {
    return JSON.stringify({ error: `Blog post not found: ${slug}` });
  }
  
  // Return a summary with key metadata
  return JSON.stringify({
    title: post.title,
    slug: post.slug,
    date: post.date,
    description: post.description,
    categories: post.categories,
    tags: post.tags,
    content_preview: post.content.slice(0, 2000) + (post.content.length > 2000 ? '...' : ''),
    url: `/blog/${slug}`
  });
}

function listPersonas(): string {
  return JSON.stringify({
    message: 'Available AI personas for tailored responses:',
    personas: personas.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      tone: p.tone,
      response_style: p.responseStyle,
      expertise: p.expertise
    }))
  });
}

function getSiteInfo(): string {
  return JSON.stringify({
    name: "Daniel Kliewer's Portfolio",
    description: 'Software Engineer & AI Practitioner based in Austin, Texas',
    tech_stack: {
      frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      ai_ml: ['Vercel AI SDK', 'RAG', 'Local LLM (Ollama)', 'MCP'],
      content: ['Markdown', 'Gray Matter', 'React Markdown'],
      deployment: ['Vercel']
    },
    features: [
      'Technical blog with 100+ posts on AI, LLMs, and software development',
      'Dynamic persona-driven AI assistant',
      'Knowledge graph visualization',
      'Advanced search and filtering',
      'Local-first AI system demonstrations'
    ],
    owner: {
      name: 'Daniel Kliewer',
      location: 'Austin, Texas',
      focus: ['LLMs', 'Autonomous Agents', 'Local-First AI', 'Data Sovereignty'],
      contact: '/contact'
    }
  });
}

function listSkills(): string {
  return JSON.stringify({
    categories: [
      {
        name: 'AI & Machine Learning',
        items: ['LLMs', 'RAG', 'Autonomous Agents', 'Local LLM (Ollama)', 'GraphRAG', 'Mixture of Experts']
      },
      {
        name: 'Full-Stack Development',
        items: ['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'Node.js']
      },
      {
        name: 'Data Engineering',
        items: ['Knowledge Graphs', 'Vector Databases', 'Data Pipelines', 'Neo4j']
      },
      {
        name: 'Infrastructure & Tools',
        items: ['Docker', 'Kubernetes', 'MCP (Model Context Protocol)', 'Git', 'CI/CD']
      }
    ]
  });
}

function getFeaturedProjects(): string {
  const projects = [
    {
      title: 'Synthetic Intelligence',
      description: 'Local-first, dynamic persona-driven knowledge synthesis system',
      slug: '2026-01-25-synthetic-intelligence',
      tags: ['AI', 'RAG', 'Local LLM', 'Persona Engineering']
    },
    {
      title: 'Dynamic Persona MoE RAG',
      description: 'Mixture of Experts RAG architecture with dynamic persona modeling',
      slug: '2026-01-22-dynamic-persona-moe-rag',
      tags: ['Mixture of Experts', 'Knowledge Graphs', 'RAG']
    },
    {
      title: 'MCP Integration',
      description: 'Model Context Protocol implementations with Ollama',
      slug: '2025-03-24-model-context-protocol',
      tags: ['MCP', 'Ollama', 'Context Management']
    },
    {
      title: 'Vibe Coding Guide',
      description: 'Document-driven development with AI assistance',
      slug: '2025-11-03-document-driven-development-nextjs-blog',
      tags: ['Vibe Coding', 'Next.js', 'AI Development']
    }
  ];
  
  return JSON.stringify({
    featured_projects: projects.map(p => ({
      ...p,
      url: `/blog/${p.slug}`
    }))
  });
}

// ============== Prompt Builder ==============

export function buildSystemPrompt(
  agent: Agent = defaultAgent,
  persona?: Persona
): string {
  let prompt = agent.systemPrompt;
  
  if (persona) {
    prompt += `\n\n## Current Persona: ${persona.name}\n${persona.systemPrompt}`;
  }
  
  prompt += `\n\n## Available Tools:
${availableTools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

When using tools, respond with JSON in this format:
{"tool": "tool_name", "args": {"param": "value"}}

## Guidelines:
1. Use search_documentation to find relevant blog posts when users ask about specific topics
2. Use get_site_info to explain the site's architecture
3. Use list_skills to show technical expertise
4. Use get_featured_projects to highlight key projects
5. Always provide links to relevant blog posts when sharing information
6. Be concise but informative
7. Adapt your technical depth based on the query`;
  
  return prompt;
}
