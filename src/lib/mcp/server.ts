/**
 * MCP (Model Context Protocol) Server Integration
 * Enables the site to interact with local data sources and tools
 */

import { 
  Server, 
  ServerSession, 
  Tool, 
  ToolExecutionOptions 
} from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { getBlogPosts, getBlogPost, getAllBlogSlugs } from '@/lib/blog';
import { z } from 'zod';

// ============== MCP Tool Definitions ==============

const blogSearchSchema = z.object({
  query: z.string().describe('Search query for blog posts'),
  limit: z.number().optional().describe('Maximum number of results')
});

const blogGetSchema = z.object({
  slug: z.string().describe('Blog post slug to retrieve')
});

// ============== Tool Implementations ==============

const tools: Tool[] = [
  {
    name: 'search_blog',
    description: 'Search through blog posts by keywords or topics',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        limit: { type: 'number', description: 'Max results (default: 5)' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_post',
    description: 'Get full content of a specific blog post',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Blog post slug' }
      },
      required: ['slug']
    }
  },
  {
    name: 'list_posts',
    description: 'List all available blog posts',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_site_info',
    description: 'Get information about the portfolio site',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_skills',
    description: 'Get technical skills and expertise areas',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_projects',
    description: 'Get featured projects and their details',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// ============== Tool Handler ==============

async function handleToolCall(
  toolName: string, 
  args: Record<string, unknown>
): Promise<string> {
  try {
    switch (toolName) {
      case 'search_blog': {
        const { query, limit = 5 } = blogSearchSchema.parse(args);
        const posts = getBlogPosts();
        const queryLower = query.toLowerCase();
        
        const results = posts
          .map(post => {
            let score = 0;
            if (post.title.toLowerCase().includes(queryLower)) score += 10;
            if ((post.description || '').toLowerCase().includes(queryLower)) score += 5;
            if ((post.tags || []).some(t => t.toLowerCase().includes(queryLower))) score += 3;
            return { post, score };
          })
          .filter(r => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
        
        return JSON.stringify({ results: results.map(r => ({
          title: r.post.title,
          slug: r.post.slug,
          description: r.post.description,
          date: r.post.date,
          tags: r.post.tags
        }))});
      }

      case 'get_post': {
        const { slug } = blogGetSchema.parse(args);
        const post = getBlogPost(slug);
        if (!post) {
          return JSON.stringify({ error: `Post not found: ${slug}` });
        }
        return JSON.stringify({
          title: post.title,
          slug: post.slug,
          date: post.date,
          description: post.description,
          content: post.content.slice(0, 5000),
          tags: post.tags,
          categories: post.categories
        });
      }

      case 'list_posts': {
        const posts = getBlogPosts();
        return JSON.stringify({
          posts: posts.map(p => ({
            title: p.title,
            slug: p.slug,
            date: p.date,
            description: p.description,
            tags: p.tags
          }))
        });
      }

      case 'get_site_info': {
        return JSON.stringify({
          name: "Daniel Kliewer's Portfolio",
          description: 'Software Engineer & AI Practitioner in Austin, Texas',
          techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vercel AI SDK'],
          focus: ['LLMs', 'Autonomous Agents', 'Local-First AI', 'Data Sovereignty'],
          location: 'Austin, Texas'
        });
      }

      case 'get_skills': {
        return JSON.stringify({
          categories: [
            { name: 'AI & ML', items: ['LLMs', 'RAG', 'Autonomous Agents', 'Local LLM', 'GraphRAG'] },
            { name: 'Full-Stack', items: ['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI'] },
            { name: 'Data', items: ['Knowledge Graphs', 'Vector DBs', 'Neo4j'] },
            { name: 'Infrastructure', items: ['Docker', 'Kubernetes', 'MCP'] }
          ]
        });
      }

      case 'get_projects': {
        return JSON.stringify({
          projects: [
            { title: 'Synthetic Intelligence', slug: '2026-01-25-synthetic-intelligence', tags: ['AI', 'RAG'] },
            { title: 'Dynamic Persona MoE RAG', slug: '2026-01-22-dynamic-persona-moe-rag', tags: ['MoE', 'RAG'] },
            { title: 'MCP Integration', slug: '2025-03-24-model-context-protocol', tags: ['MCP', 'Ollama'] }
          ]
        });
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (error) {
    return JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// ============== MCP Server Setup ==============

export async function createMCPServer() {
  const server = new Server(
    {
      name: 'danielkliewer-portfolio',
      version: '1.0.0',
      description: 'MCP server for Daniel Kliewer\'s portfolio - provides access to blog posts, skills, and site information'
    },
    {
      capabilities: {
        tools: tools.reduce((acc, tool) => {
          acc[tool.name] = {
            description: tool.description,
            inputSchema: tool.inputSchema
          };
          return acc;
        }, {} as Record<string, unknown>)
      }
    }
  );

  // Register tool handlers
  server.setRequestHandler('tools/list', async () => {
    return { tools };
  });

  server.setRequestHandler('tools/call', async (request: { name: string; arguments: Record<string, unknown> }) => {
    const result = await handleToolCall(request.name, request.arguments);
    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  });

  return server;
}

// ============== Standalone MCP Server ==============

/**
 * Run as standalone MCP server (for local development)
 * Usage: npx tsx src/lib/mcp/server.ts
 */
export async function runStandaloneMCPServer() {
  const server = await createMCPServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  console.error('MCP Server running on stdio');
}

// Run if executed directly
if (require.main === module) {
  runStandaloneMCPServer().catch(console.error);
}
