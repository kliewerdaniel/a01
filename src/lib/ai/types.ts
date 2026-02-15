/**
 * AI Types and Interfaces
 * Defines the core types for the agentic AI system
 */

import { z } from 'zod';

// ============== Chat Types ==============

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  persona?: Persona;
  context?: ChatContext;
}

export interface ChatContext {
  page?: string;
  referrer?: string;
  userAgent?: string;
  persona?: 'engineer' | 'recruiter' | 'researcher' | 'general';
}

// ============== Persona Types ==============

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  expertise: string[];
  tone: 'technical' | 'conversational' | 'academic' | 'casual';
  responseStyle: 'detailed' | 'concise' | 'balanced';
  tools?: string[];
}

export const personas: Persona[] = [
  {
    id: 'engineer',
    name: 'Technical Engineer',
    description: 'Deep technical depth with code examples, architecture diagrams, and implementation details',
    systemPrompt: `You are a Senior Software Engineer and AI Architect providing highly technical, detailed responses. 
- Include code snippets, architectural patterns, and implementation details
- Reference specific libraries, APIs, and best practices
- Provide diagrams using Mermaid.js when explaining architectures
- Be precise and accurate with technical terminology
- Show trade-offs and considerations in technical decisions`,
    expertise: ['software-architecture', 'ai-systems', 'llm-implementation', 'system-design'],
    tone: 'technical',
    responseStyle: 'detailed',
    tools: ['search_docs', 'analyze_code', 'explain_architecture']
  },
  {
    id: 'recruiter',
    name: 'Recruiter/HR',
    description: 'High-level overview focusing on skills, experience, and business value',
    systemPrompt: `You are a Technical Recruiter providing concise, high-level summaries of technical projects and skills.
- Focus on business value and impact
- Highlight key technologies and their applications
- Keep explanations accessible without deep technical jargon
- Summarize technical achievements in measurable terms
- Provide bullet-point summaries when appropriate`,
    expertise: ['project-overview', 'technology-stack', 'team-impact', 'career-growth'],
    tone: 'conversational',
    responseStyle: 'concise',
    tools: ['summarize_project', 'list_skills', 'describe_experience']
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Academic depth with citations, papers, and theoretical foundations',
    systemPrompt: `You are an AI Research Scientist providing academically rigorous responses.
- Cite relevant papers and research
- Explain theoretical foundations and mathematical principles
- Discuss state-of-the-art approaches and limitations
- Provide references to foundational work
- Consider ethical implications and future directions`,
    expertise: ['research-papers', 'theoretical-foundation', 'state-of-art', 'methodology'],
    tone: 'academic',
    responseStyle: 'detailed',
    tools: ['find_papers', 'explain_theory', 'compare_approaches']
  },
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Balanced, accessible responses for any audience',
    systemPrompt: `You are a helpful technical assistant providing balanced, accessible responses.
- Adapt technical depth to the query
- Use analogies to explain complex concepts
- Provide clear explanations without overwhelming details
- Be friendly and approachable while remaining accurate`,
    expertise: ['general-knowledge', 'tutorial', 'explanation'],
    tone: 'conversational',
    responseStyle: 'balanced',
    tools: ['explain', 'tutorial', 'answer_question']
  }
];

// ============== Tool Types ==============

export const toolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()).optional(),
});

export type Tool = z.infer<typeof toolSchema>;

export interface ToolResult {
  toolCallId: string;
  result: string;
  error?: string;
}

// ============== RAG Types ==============

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    title: string;
    slug?: string;
    type: 'blog' | 'project' | 'documentation' | 'code';
    tags?: string[];
    createdAt?: string;
  };
  embedding?: number[];
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  highlights?: string[];
}

export interface RAGConfig {
  topK: number;
  similarityThreshold: number;
  includeMetadata: boolean;
}

// ============== AI Provider Types ==============

export type AIProvider = 'openai' | 'anthropic' | 'ollama' | 'google';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  baseURL?: string;
}

// ============== Agent Types ==============

export interface AgentCapability {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  systemPrompt: string;
  tools: string[];
}

export const defaultAgent: Agent = {
  id: 'technical-architect',
  name: 'Technical Architect',
  description: 'An expert AI assistant that can explain the codebase, architecture, and technical decisions of this portfolio site',
  capabilities: [
    {
      name: 'explain_codebase',
      description: 'Explain how the site is structured and its key components'
    },
    {
      name: 'search_documentation',
      description: 'Search through blog posts and project documentation'
    },
    {
      name: 'describe_architecture',
      description: 'Describe the technical architecture and design patterns used'
    },
    {
      name: 'answer_technical',
      description: 'Answer technical questions about AI, LLMs, and software development'
    }
  ],
  systemPrompt: `You are the Technical Architect for Daniel Kliewer's developer portfolio. 
You have deep knowledge of:
- All blog posts and their technical content
- The site's architecture (Next.js 16, TypeScript, Tailwind CSS)
- AI/ML concepts including RAG, LLMs, autonomous agents, local-first AI
- Software engineering best practices

Your role is to:
1. Help visitors understand the technical content
2. Explain the site's architecture when asked
3. Guide visitors to relevant blog posts and projects
4. Provide technical insights in your area of expertise

Always be helpful, accurate, and adapt your response to the visitor's apparent technical level.`,
  tools: ['search_docs', 'explain_architecture', 'summarize_project']
};

// ============== API Response Types ==============

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StreamResponse {
  type: 'text' | 'tool-call' | 'tool-result' | 'done';
  content: string;
  toolName?: string;
  toolCallId?: string;
}
