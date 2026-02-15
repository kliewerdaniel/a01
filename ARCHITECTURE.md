# Daniel Kliewer Portfolio - Technical Architecture

## Overview

This portfolio site is built with a focus on **Recursive Architecture** - demonstrating the advanced AI and data integrity principles advocated through the content.

## Tech Stack

- **Framework**: Next.js 16 with React Server Components
- **Language**: TypeScript (100% type safety)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **AI**: Vercel AI SDK with tool calling
- **Protocols**: MCP (Model Context Protocol) integration
- **Testing**: Playwright + Vitest

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── chat/         # AI Chat API endpoint
│   └── ...               # Pages
├── components/
│   ├── ai/               # AI components (chat, assistants)
│   ├── bento/            # Bento grid layouts
│   └── docs/             # Documentation components
└── lib/
    ├── ai/               # AI types, tools, utilities
    ├── mcp/              # MCP server integration
    └── seo.ts            # Advanced SEO configuration
```

## Key Features

### 1. Agentic AI Platform

- **Vercel AI SDK Integration**: Streaming chat with tool calling
- **Multiple Personas**: Engineer, Recruiter, Researcher, General modes
- **Context-Aware**: Adapts responses based on visitor profile
- **Tool Calling**: Search docs, get posts, list skills dynamically

### 2. MCP (Model Context Protocol)

- Standalone MCP server for local integration
- Blog search, skills, projects accessible via protocol
- Connects with Ollama for local LLM inference

### 3. Technical Documentation System

- Markdown-driven with Mermaid.js diagrams
- Interactive code blocks with copy functionality
- Table of contents navigation
- Spec-driven development approach

### 4. Bento-Box Dashboard

- Modern grid layout with gradient backgrounds
- Animated card interactions
- Responsive design
- Project and skill showcase

### 5. SEO & Observability

- Advanced OpenGraph + Twitter cards
- JSON-LD structured data
- Sentry error tracking
- Vercel Analytics integration

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run Playwright UI
npm run test:ui
```

## Environment Variables

Create `.env.local`:

```env
# AI Providers (optional - uses demo mode by default)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant...

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://...

# MCP Server
MCP_PORT=3001
```

## AI Personas

| Persona | Description | Best For |
|---------|-------------|----------|
| Engineer | Deep technical details, code examples | Developers |
| Recruiter | High-level overview, business value | HR/Recruiters |
| Researcher | Academic depth, citations | Researchers |
| General | Balanced, accessible | General visitors |

## MCP Integration

The site exposes an MCP server that can be connected to Claude Desktop or other MCP clients:

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "npx",
      "args": ["tsx", "src/lib/mcp/server.ts"]
    }
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Deployment

The site deploys automatically to Vercel via GitHub Actions CI/CD pipeline:

1. Push to `main` branch triggers production deployment
2. Pull requests create preview deployments
3. Tests run before deployment

## Contributing

1. Create a feature branch
2. Make changes with TypeScript strict mode
3. Add tests for new features
4. Submit a pull request

## License

MIT
