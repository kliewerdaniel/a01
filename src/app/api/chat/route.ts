/**
 * AI Chat API Endpoint
 * Handles streaming chat requests with tool calling
 * Supports Ollama (local), Gemini (free tier), and Anthropic (cloud) providers
 */

import { Ollama, type Message, type Tool, type ToolCall } from 'ollama';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI, type Content, type Tool as GeminiTool } from '@google/generative-ai';
import { z } from 'zod';
import { 
  buildSystemPrompt, 
  availableTools, 
  executeTool
} from '@/lib/ai/tools';
import { defaultAgent, personas, type Persona } from '@/lib/ai/types';
import { getAllBlogSlugs, blogPostExists } from '@/lib/blog';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

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

// ============== Configuration ==============

function getLLMProvider(): string {
  return process.env.LLM_PROVIDER || 'ollama';
}

function getOllamaHost(): string {
  return process.env.OLLAMA_HOST || 'http://localhost:11434';
}

function getOllamaModel(): string {
  return process.env.OLLAMA_MODEL || 'llama3.2:3b';
}

function getAnthropicApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

// ============== Ollama Functions ==============

function getOllamaClient(): Ollama {
  return new Ollama({ host: getOllamaHost() });
}

function getOllamaTools(): Tool[] {
  return availableTools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters as {
        type: 'object';
        properties: Record<string, { type: string; description?: string }>;
        required?: string[];
      }
    }
  }));
}

async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const client = getOllamaClient();
    await client.list();
    return true;
  } catch {
    return false;
  }
}

// ============== Anthropic Functions ==============

function getAnthropicClient(): Anthropic | null {
  const apiKey = getAnthropicApiKey();
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return null;
  }
  return new Anthropic({ apiKey });
}

function getAnthropicTools() {
  return availableTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters as { type: 'object'; properties: Record<string, unknown>; required?: string[] }
  }));
}

// ============== Gemini Functions ==============

function isGeminiEnabled(): boolean {
  return process.env.GEMINI_ENABLED === 'true';
}

function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

function getGeminiModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-1.5-flash-8b';
}

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

function getGeminiTools(): GeminiTool[] {
  return availableTools.map(tool => ({
    functionDeclarations: [{
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters as any
    }]
  }));
}

// ============== Main Handler ==============

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = ChatRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: validation.error.issues }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages, personaId, temperature = 0.7 } = validation.data;
    
    const persona: Persona | undefined = personaId 
      ? personas.find(p => p.id === personaId)
      : undefined;
    
    const systemPrompt = buildSystemPrompt(defaultAgent, persona);
    const provider = getLLMProvider();
    
    // Route to appropriate provider
    if (provider === 'gemini') {
      return await handleGemini(messages, persona, systemPrompt, temperature);
    } else if (provider === 'anthropic') {
      return await handleAnthropic(messages, persona, systemPrompt, temperature);
    } else {
      return await handleOllama(messages, persona, systemPrompt, temperature);
    }
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ============== Ollama Handler ==============

async function handleOllama(
  messages: { role: string; content: string }[],
  persona: Persona | undefined,
  systemPrompt: string,
  temperature: number
) {
  let isOllamaAvailable = false;
  
  try {
    isOllamaAvailable = await checkOllamaAvailability();
  } catch (error) {
    console.log('Ollama availability check failed:', error);
  }
  
  if (!isOllamaAvailable) {
    console.log('Ollama not available, using demo mode');
    return handleDemoMode(messages, persona);
  }
  
  try {
    const ollamaMessages: Message[] = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role as 'user' | 'assistant' | 'tool', content: m.content }));
    
    ollamaMessages.unshift({ role: 'system', content: systemPrompt });
    
    const client = getOllamaClient();
    const model = getOllamaModel();
    let finalText = '';
    
    for (let iteration = 0; iteration < 5; iteration++) {
      const response = await client.chat({
        model,
        messages: ollamaMessages,
        tools: getOllamaTools(),
        options: { temperature }
      });
      
      const assistantMessage = response.message;
      finalText = assistantMessage.content;
      const toolCalls = assistantMessage.tool_calls;
      
      if (!toolCalls || toolCalls.length === 0) break;
      
      ollamaMessages.push({ role: 'assistant', content: '', tool_calls: toolCalls as ToolCall[] });
      
      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        let toolArgs = toolCall.function.arguments;
        
        if (typeof toolArgs === 'string') {
          try { toolArgs = JSON.parse(toolArgs); } catch { toolArgs = {}; }
        }
        
        console.log(`Executing tool: ${toolName}`, toolArgs);
        
        try {
          const toolResult = await executeTool(toolName, toolArgs);
          ollamaMessages.push({ role: 'tool', content: toolResult });
        } catch (error) {
          ollamaMessages.push({ role: 'tool', content: JSON.stringify({ error: `Tool execution failed: ${error}` }) });
        }
      }
    }
    
    return streamResponse(finalText);
  } catch (error) {
    console.error('Ollama chat error:', error);
    return handleDemoMode(messages, persona);
  }
}

// ============== Anthropic Handler ==============

async function handleAnthropic(
  messages: { role: string; content: string }[],
  persona: Persona | undefined,
  systemPrompt: string,
  temperature: number
) {
  const anthropic = getAnthropicClient();
  
  if (!anthropic) {
    console.log('Anthropic not configured, using demo mode');
    return handleDemoMode(messages, persona);
  }
  
  const anthropicMessages: Anthropic.MessageParam[] = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ 
      role: (m.role === 'tool' ? 'assistant' : m.role) as 'user' | 'assistant', 
      content: m.content 
    }));
  
  let currentMessages = [...anthropicMessages];
  let finalText = '';
  
  for (let iteration = 0; iteration < 5; iteration++) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature,
      system: systemPrompt,
      messages: currentMessages,
      tools: getAnthropicTools(),
    });
    
    let hasToolUse = false;
    
    for (const block of response.content) {
      if (block.type === 'text') {
        finalText += block.text;
      } else if (block.type === 'tool_use') {
        hasToolUse = true;
        const toolName = block.name;
        const toolArgs = block.input as Record<string, unknown>;
        
        console.log(`Executing tool: ${toolName}`, toolArgs);
        
        try {
          const toolResult = await executeTool(toolName, toolArgs);
          
          currentMessages.push({
            role: 'assistant',
            content: [{ type: 'tool_use', id: block.id, name: block.name, input: block.input }]
          });
          
          currentMessages.push({
            role: 'user',
            content: [{ type: 'tool_result', tool_use_id: block.id, content: toolResult }]
          });
        } catch (error) {
          currentMessages.push({
            role: 'user',
            content: [{ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify({ error: `Tool failed: ${error}` }), is_error: true }]
          });
        }
      }
    }
    
    if (!hasToolUse) break;
  }
  
  return streamResponse(finalText);
}

// ============== Gemini Handler ==============

async function handleGemini(
  messages: { role: string; content: string }[],
  persona: Persona | undefined,
  systemPrompt: string,
  temperature: number
) {
  const genAI = getGeminiClient();
  
  if (!genAI) {
    console.log('Gemini not configured, using demo mode');
    return handleDemoMode(messages, persona);
  }
  
  const model = genAI.getGenerativeModel({
    model: getGeminiModel(),
    tools: getGeminiTools()
  });
  
  // Get the last user message - this is what we're responding to
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') {
    return streamResponse('Hello! How can I help you today?');
  }
  
  // Build conversation history for Gemini
  // Previous messages (excluding the last one we're responding to)
  const previousMessages = messages.slice(0, -1);
  
  // Build history - only include user messages since Gemini generates model responses
  // This ensures history starts with user (which is required)
  const history: Content[] = [];
  for (const msg of previousMessages) {
    if (msg.role === 'user') {
      history.push({
        role: 'user',
        parts: [{ text: msg.content }]
      });
    }
    // Skip assistant/tool messages - Gemini will regenerate them
    // This is a simplification but works for most cases
  }
  
  // Start chat with history
  const chat = model.startChat({
    history,
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature,
      maxOutputTokens: 8192,
    }
  });
  
  let finalText = '';
  
  for (let iteration = 0; iteration < 5; iteration++) {
    // Send the user message
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const candidate = response.candidates?.[0];
    
    if (!candidate?.content?.parts) {
      break;
    }
    
    // Check for function calls
    const functionCalls = candidate.content.parts.filter(
      (part): part is { functionCall: { name: string; args: Record<string, unknown> } } => 
        'functionCall' in part
    );
    
    if (functionCalls.length === 0) {
      // Regular text response
      const textParts = candidate.content.parts.filter(
        (part): part is { text: string } => 'text' in part
      );
      finalText = textParts.map(p => p.text).join('');
      break;
    }
    
    // Handle function calls
    for (const fc of functionCalls) {
      const toolName = fc.functionCall.name;
      const toolArgs = fc.functionCall.args;
      
      console.log(`Executing tool: ${toolName}`, toolArgs);
      
      try {
        const toolResult = await executeTool(toolName, toolArgs);
        
        // Send tool result back - Gemini handles this via function response
        const toolResponse = await chat.sendMessage([
          {
            functionResponse: {
              name: toolName,
              response: { result: toolResult }
            }
          }
        ]);
        
        // Get the model's response after tool use
        const toolCandidate = toolResponse.response.candidates?.[0];
        if (toolCandidate?.content?.parts) {
          // Check if there are more function calls
          const moreCalls = toolCandidate.content.parts.filter(
            (part): part is { functionCall: { name: string; args: Record<string, unknown> } } => 
              'functionCall' in part
          );
          
          if (moreCalls.length === 0) {
            // No more function calls, get text response
            const textParts = toolCandidate.content.parts.filter(
              (part): part is { text: string } => 'text' in part
            );
            finalText = textParts.map(p => p.text).join('');
          }
        }
      } catch (error) {
        finalText = JSON.stringify({ error: `Tool execution failed: ${error}` });
      }
    }
  }
  
  return streamResponse(finalText);
}

// ============== Demo Mode ==============

async function handleDemoMode(
  messages: { role: string; content: string }[], 
  persona?: Persona
) {
  const userMessage = messages[messages.length - 1]?.content || '';
  const responseText = generateDemoResponse(userMessage, persona);
  return streamResponse(responseText);
}

function streamResponse(text: string) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const chunks = text.split(' ');
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk + ' '));
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' }
  });
}

// Helper to validate and filter blog links in responses
function filterValidBlogLinks(links: { text: string; slug: string }[]): { text: string; slug: string }[] {
  return links.filter(link => blogPostExists(link.slug));
}

function generateDemoResponse(userMessage: string, persona?: Persona): string {
  const query = userMessage.toLowerCase();
  const isRecruiter = persona?.id === 'recruiter';
  
  // Get valid blog slugs for filtering
  const validLocalLLMLinks = filterValidBlogLinks([
    { text: "Ollama Guide", slug: "2025-12-19-langchain-ollama" },
    { text: "Local LLM Integration", slug: "2025-11-08-local-llm-integration" },
    { text: "llama.cpp Guide", slug: "2025-11-12-mastering-llama-cpp-local-llm-integration-guide" }
  ]);
  
  const validAgentLinks = filterValidBlogLinks([
    { text: "Creating AI Agents", slug: "2024-10-30-creating-ai-agents" },
    { text: "Autonomous Architectures", slug: "2026-01-03-autonomous-architectures" },
    { text: "Basic Autogen", slug: "2024-11-28-basic-autogen" }
  ]);
  
  const validRAGLinks = filterValidBlogLinks([
    { text: "Basic RAG", slug: "2024-12-01-basic-rag" },
    { text: "Pydantic RAG", slug: "2024-12-09-pydantic-rag" },
    { text: "Building Knowledge Chatbot", slug: "2026-02-19-building-knowledge-chatbot" }
  ]);
  
  const validMCPLinks = filterValidBlogLinks([
    { text: "MCP Guide", slug: "2025-03-24-model-context-protocol" },
    { text: "MCP Integration", slug: "2025-12-09-mcp-integration-uncensored-chatbot" },
    { text: "MCP with OpenAI", slug: "2025-03-12-mcp-openai-agents-sdk-ollama" }
  ]);
  
  const validVibeCodingLinks = filterValidBlogLinks([
    { text: "Rise of Vibe Coding", slug: "2025-11-02-rise-of-vibe-coding" },
    { text: "Vibe Coding Guide", slug: "2025-10-20-how-to-vibe-code-a-nextjs-boilerplate-repo" },
    { text: "Document-Driven Development", slug: "2025-11-03-document-driven-development-nextjs-blog" }
  ]);
  
  const validSyntheticIntelLinks = filterValidBlogLinks([
    { text: "Synthetic Intelligence", slug: "2026-01-25-synthetic-intelligence" },
    { text: "Dynamic Persona MoE RAG", slug: "2026-01-22-dynamic-persona-moe-rag" },
    { text: "From Scaffolding to Reality", slug: "2026-01-22-from-scaffolding-to-reality-building-the-dynamic-persona-moe-rag-system" }
  ]);
  
  // Build link sections dynamically
  const buildLinkSection = (links: { text: string; slug: string }[]) => {
    if (links.length === 0) return "";
    return links.map(l => `- [${l.text}](/blog/${l.slug})`).join('\n');
  };
  
  if (query.includes('local llm') || query.includes('ollama') || query.includes('llama.cpp')) {
    const links = buildLinkSection(validLocalLLMLinks);
    return isRecruiter
      ? "Daniel has extensive experience with local LLMs including Ollama and llama.cpp. He's written several guides on running LLMs locally."
      : `Great question! Daniel has written several blog posts about running local LLMs:\n\n**Local LLM Guides:**\n${links || "Check out the blog for more articles on local LLMs!"}`;
  }
  
  if (query.includes('agent') || query.includes('autonomous')) {
    const links = buildLinkSection(validAgentLinks);
    return isRecruiter
      ? "Daniel has built multiple AI agent systems including autonomous architectures and multi-agent systems."
      : `Here's what Daniel has written about AI agents:\n\n**AI Agents:**\n${links || "Check out the blog for more articles on AI agents!"}`;
  }
  
  if (query.includes('rag') || query.includes('knowledge graph')) {
    const links = buildLinkSection(validRAGLinks);
    return isRecruiter
      ? "Daniel has deep expertise in RAG systems including knowledge graph RAG implementations."
      : `Here's Daniel's content on RAG systems:\n\n**RAG & Knowledge Graphs:**\n${links || "Check out the blog for more articles on RAG!"}`;
  }
  
  if (query.includes('mcp') || query.includes('model context')) {
    const links = buildLinkSection(validMCPLinks);
    return isRecruiter
      ? "Daniel has implemented the Model Context Protocol (MCP) with various LLM providers."
      : `Here's Daniel's content on MCP:\n\n**Model Context Protocol:**\n${links || "Check out the blog for more articles on MCP!"}`;
  }
  
  if (query.includes('vibe coding')) {
    const links = buildLinkSection(validVibeCodingLinks);
    return isRecruiter
      ? "Daniel is a strong advocate of vibe coding and document-driven development methodologies."
      : `Here's Daniel's vibe coding content:\n\n**Vibe Coding:**\n${links || "Check out the blog for more articles on vibe coding!"}`;
  }
  
  if (query.includes('synthetic intelligence') || query.includes('persona')) {
    const links = buildLinkSection(validSyntheticIntelLinks);
    return isRecruiter
      ? "Daniel created a comprehensive synthetic intelligence system with dynamic personas."
      : `Here's Daniel's work on synthetic intelligence:\n\n**Synthetic Intelligence:**\n${links || "Check out the blog for more articles on synthetic intelligence!"}`;
  }
  
  if (query.includes('search') || query.includes('find') || query.includes('blog')) {
    return isRecruiter
      ? "I'd be happy to help you explore Daniel's blog! He has 100+ technical articles on AI, LLMs, and software development."
      : "I can help you explore the blog! Use the search to find articles on AI, LLMs, RAG, autonomous agents, and more.\n\n**Popular Topics:**\n- [Local LLM Integration](/blog/2025-11-08-local-llm-integration)\n- [AI Agents](/blog/2024-10-30-creating-ai-agents)\n- [MCP Guide](/blog/2025-03-24-model-context-protocol)";
  }
  
  if (query.includes('skill') || query.includes('expert') || query.includes('tech')) {
    return isRecruiter
      ? "Daniel's core technical expertise includes: AI/ML (LLMs, RAG, Autonomous Agents), Full-Stack Development (Next.js, React, Python), Data Engineering (Knowledge Graphs, Vector Databases), and Infrastructure (Docker, Kubernetes, MCP)."
      : "Key technical skills:\n\n**AI & ML**: LLMs, RAG, Autonomous Agents, Local LLM (Ollama), GraphRAG\n\n**Full-Stack**: Next.js, React, TypeScript, Python, FastAPI\n\n**Data**: Knowledge Graphs, Vector Databases, Neo4j\n\n**Infrastructure**: Docker, Kubernetes, MCP\n\n**Learn more:**\n- [Local LLM Integration](/blog/2025-11-08-local-llm-integration)\n- [Basic RAG](/blog/2024-12-01-basic-rag)";
  }
  
  if (query.includes('project') || query.includes('work') || query.includes('portfolio')) {
    return isRecruiter
      ? "Featured projects include: 1) Synthetic Intelligence - a local-first persona-driven AI system, 2) Dynamic Persona MoE RAG - mixture of experts architecture, 3) MCP Integration - Model Context Protocol implementations."
      : "Featured Projects:\n\n1. **Synthetic Intelligence** - Local-first, dynamic persona-driven knowledge synthesis\n   [Read more](/blog/2026-01-25-synthetic-intelligence)\n\n2. **Dynamic Persona MoE RAG** - Mixture of Experts RAG\n   [Read more](/blog/2026-01-22-dynamic-persona-moe-rag)\n\n3. **MCP Integration** - Model Context Protocol with Ollama\n   [Read more](/blog/2025-03-24-model-context-protocol)\n\n4. **Vibe Coding Guide** - Document-driven development\n   [Read more](/blog/2025-11-03-document-driven-development-nextjs-blog)";
  }
  
  if (query.includes('about') || query.includes('who') || query.includes('contact')) {
    return isRecruiter
      ? "Daniel Kliewer is a Software Engineer & AI Practitioner based in Austin, Texas. He's available for freelance projects and open to full-time opportunities in AI/ML."
      : "Hi! I'm Daniel Kliewer, a Software Engineer & AI Practitioner in Austin, Texas. I build practical AI applications and am passionate about data sovereignty.\n\n[Learn more about this project](/blog/2026-02-15-building-this-blog)";
  }
  
  return isRecruiter
    ? "I'm here to help you learn about Daniel's work! I can tell you about his skills, projects, blog topics, or background."
    : "I'm the Technical Architect AI assistant! I can help you find blog posts, learn about skills/projects, or answer questions about AI/LLMs.\n\n**Try these topics:**\n- [Local LLMs](/blog/2025-11-08-local-llm-integration)\n- [AI Agents](/blog/2024-10-30-creating-ai-agents)\n- [RAG Systems](/blog/2024-12-01-basic-rag)\n- [MCP](/blog/2025-03-24-model-context-protocol)";
}

// ============== Health Check ==============

export async function GET() {
  const provider = getLLMProvider();
  let status = 'demo_mode';
  let model = 'N/A';
  
  if (provider === 'gemini') {
    const apiKey = getGeminiApiKey();
    const enabled = isGeminiEnabled();
    if (apiKey && enabled) {
      status = 'available';
      model = getGeminiModel();
    }
  } else if (provider === 'anthropic') {
    const apiKey = getAnthropicApiKey();
    if (apiKey && apiKey !== 'your_anthropic_api_key_here') {
      status = 'available';
      model = 'claude-sonnet-4-20250514';
    }
  } else {
    const isOllamaAvailable = await checkOllamaAvailability();
    if (isOllamaAvailable) {
      status = 'available';
      model = getOllamaModel();
    }
  }
  
  return new Response(
    JSON.stringify({
      api_status: 'ok',
      service: 'AI Chat API',
      version: '5.0.0',
      availablePersonas: personas.map(p => p.id),
      features: ['streaming', 'tool_calling', 'persona_selection'],
      provider,
      model,
      status,
      configuration: {
        local_development: 'Use LLM_PROVIDER=ollama (default)',
        gemini: 'Set LLM_PROVIDER=gemini, GEMINI_ENABLED=true',
        vercel_deployment: 'Set LLM_PROVIDER=anthropic and add ANTHROPIC_API_KEY to Vercel env vars'
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
