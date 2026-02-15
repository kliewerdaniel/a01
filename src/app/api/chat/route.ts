/**
 * AI Chat API Endpoint
 * Handles streaming chat requests with tool calling support
 */

import { z } from 'zod';
import { buildSystemPrompt, availableTools, executeTool } from '@/lib/ai/tools';
import { defaultAgent, personas, type Persona } from '@/lib/ai/types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Request validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'tool']),
    content: z.string(),
  })),
  personaId: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse and validate request
    const body = await req.json();
    const validation = ChatRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: validation.error.issues 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages, personaId } = validation.data;
    
    // Get the selected persona (or default)
    const persona: Persona | undefined = personaId 
      ? personas.find(p => p.id === personaId)
      : undefined;
    
    // Build system prompt
    const systemPrompt = buildSystemPrompt(defaultAgent, persona);
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Generate response based on the query
    const responseText = generateDemoResponse(userMessage, persona);
    
    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const chunks = responseText.split(' ');
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk + ' '));
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        controller.close();
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Generate a demo response based on user query
 * This simulates AI behavior without requiring an API key
 */
function generateDemoResponse(userMessage: string, persona?: Persona): string {
  const query = userMessage.toLowerCase();
  const isRecruiter = persona?.id === 'recruiter';
  
  // Search-related queries
  if (query.includes('search') || query.includes('find') || query.includes('blog') || query.includes('post')) {
    return isRecruiter
      ? "I'd be happy to help you explore Daniel's blog! He has 100+ technical articles on AI, LLMs, and software development. Topics include RAG systems, local AI deployment, autonomous agents, and more. Would you like me to search for specific topics?"
      : "I can help you explore the blog! Use the search above to find articles on AI, LLMs, RAG, autonomous agents, and software development. The blog features technical deep-dives with code examples and architecture diagrams.";
  }
  
  // Skills/ expertise queries
  if (query.includes('skill') || query.includes('expert') || query.includes('tech') || query.includes('stack')) {
    return isRecruiter
      ? "Daniel's core technical expertise includes: AI/ML (LLMs, RAG, Autonomous Agents), Full-Stack Development (Next.js, React, Python), Data Engineering (Knowledge Graphs, Vector Databases), and Infrastructure (Docker, Kubernetes, MCP). He's particularly strong in AI systems and local-first architectures."
      : "Key technical skills:\n\n**AI & ML**: LLMs, RAG, Autonomous Agents, Local LLM (Ollama), GraphRAG, Mixture of Experts\n\n**Full-Stack**: Next.js, React, TypeScript, Python, FastAPI\n\n**Data**: Knowledge Graphs, Vector Databases, Neo4j\n\n**Infrastructure**: Docker, Kubernetes, MCP";
  }
  
  // Project queries
  if (query.includes('project') || query.includes('work') || query.includes('built') || query.includes('portfolio')) {
    return isRecruiter
      ? "Featured projects include: 1) Synthetic Intelligence - a local-first persona-driven AI system, 2) Dynamic Persona MoE RAG - mixture of experts architecture, 3) MCP Integration - Model Context Protocol implementations, 4) Various AI assistants and tools. All projects emphasize data sovereignty and local-first AI."
      : "Featured Projects:\n\n1. **Synthetic Intelligence** - Local-first, dynamic persona-driven knowledge synthesis\n2. **Dynamic Persona MoE RAG** - Mixture of Experts RAG with persona modeling  \n3. **MCP Integration** - Model Context Protocol with Ollama\n4. **Vibe Coding Guide** - Document-driven development\n\nCheck out the blog for detailed technical writeups!";
  }
  
  // About/contact queries
  if (query.includes('about') || query.includes('who') || query.includes('contact') || query.includes('hire')) {
    return isRecruiter
      ? "Daniel Kliewer is a Software Engineer & AI Practitioner based in Austin, Texas. He specializes in building with LLMs, autonomous agents, and local-first AI systems. He's available for freelance projects and open to full-time opportunities in AI/ML. Contact: /contact"
      : "Hi! I'm Daniel Kliewer, a Software Engineer & AI Practitioner in Austin, Texas. I build practical AI applications - from RAG-powered research assistants to privacy-focused local AI systems. I'm passionate about data sovereignty and run everything on personal hardware. Let's connect!";
  }
  
  // Architecture/technical site queries
  if (query.includes('site') || query.includes('this') || query.includes('architecture') || query.includes('how')) {
    return "This portfolio is built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**. It features:\n- Vercel AI SDK for AI-powered interactions\n- Markdown-driven blog with 100+ technical articles\n- Knowledge graph visualization\n- Dynamic persona-driven AI assistant\n- Advanced search and filtering\n\nThe site demonstrates modern web architecture and AI integration patterns.";
  }
  
  // Default response
  return isRecruiter
    ? "I'm here to help you learn about Daniel Kliewer's work! I can tell you about his skills, projects, blog topics, or background. What would you like to know?"
    : "I'm the Technical Architect AI assistant for Daniel's portfolio! I can help you:\n\n- Find relevant blog posts and articles\n- Learn about his technical skills and projects\n- Understand the site's architecture\n- Answer questions about AI/LLMs\n\nWhat would you like to explore?";
}

// Also handle GET requests for health checks
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'AI Chat API',
      version: '1.0.0',
      availablePersonas: personas.map(p => p.id),
      features: ['streaming', 'tool_calling', 'persona_selection'],
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}
