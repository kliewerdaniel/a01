'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    title: "synt - Synthetic Intelligence",
    description: "A revolutionary, air-gapped Local-First Dynamic Persona Intelligence System that transforms large, heterogeneous corpuses into grounded, attributable, and conversationally explorable intelligence using deterministic generative models. Built with privacy at its core—your data never leaves your machine.",
    tags: ["AI", "Local LLM", "Privacy", "Persona System", "Knowledge Synthesis"],
    github: "https://github.com/kliewerdaniel/synt",
  },
  {
    title: "Dynamic Persona MoE RAG",
    description: "A dynamic graph-based Mixture-of-Experts RAG system using persona JSON files and local Ollama models for personalized knowledge synthesis. Switch between different AI personas seamlessly to get contextually relevant answers from your documents.",
    tags: ["RAG", "Mixture of Experts", "Ollama", "Python", "Knowledge Graph"],
    github: "https://github.com/kliewerdaniel/dynamic_persona_moe_rag",
  },
  {
    title: "StratAgent",
    description: "A collaborative AI development environment where specialized AI personas work together to build software projects through natural language requirements. Multiple agents with different specialties collaborate to turn ideas into working code.",
    tags: ["AI Agents", "Development Workflow", "Multi-Agent", "Code Generation"],
    github: "https://github.com/kliewerdaniel/stratagent",
  },
  {
    title: "SpecGen",
    description: "Transform natural language specifications into production-ready application skeletons using AI-powered agentic workflows. Describe what you want to build in plain English, and SpecGen generates the foundational code structure.",
    tags: ["Code Generation", "AI Agents", "Development Tools", "Automation"],
    github: "https://github.com/kliewerdaniel/specgen",
  },
  {
    title: "ACE-Step",
    description: "ACE-Step: A Step Towards Music Generation Foundation Model - innovative AI music creation system exploring the boundaries of AI-generated audio. Built on insights from audio generation research.",
    tags: ["Music AI", "Deep Learning", "Audio Generation", "Research"],
    github: "https://github.com/kliewerdaniel/ACE-Step",
  },
  {
    title: "AutoBlog01",
    description: "A professional Next.js blogging platform with AI-driven content generation using RSS feed analysis and Retrieval-Augmented Generation (RAG). Automatically generate blog posts from your favorite RSS feeds with AI-powered summaries and insights.",
    tags: ["Next.js", "RAG", "AI Content", "SEO", "RSS"],
    github: "https://github.com/kliewerdaniel/autoblog01",
  },
  {
    title: "Orthos",
    description: "A Locally Sovereign, Replayable, Graph-Executed Cognitive System for building privacy-focused AI applications. Every AI interaction is recorded in a knowledge graph for complete transparency and replayability.",
    tags: ["Local AI", "Graph Execution", "Privacy", "Cognitive System", "Knowledge Graph"],
    github: "https://github.com/kliewerdaniel/orthos",
  },
  {
    title: "MCBot01 - GraphRAG Research Assistant",
    description: "A comprehensive AI-powered research assistant combining Graph Database technology with GraphRAG and MCP integration for intelligent document processing. Upload PDFs, papers, or documents and query them conversationally with cited sources.",
    tags: ["GraphRAG", "Research", "MCP", "Knowledge Graph", "Document Analysis"],
    github: "https://github.com/kliewerdaniel/mcbot01",
  },
  {
    title: "BotChat",
    description: "A modern full-stack AI chat application combining Google's Gemma language model with NotebookLM integration via MCP. Experience seamless AI conversations with local model support and rich context integration.",
    tags: ["Chatbot", "Next.js", "MCP", "Gemma", "Local LLM"],
    github: "https://github.com/kliewerdaniel/BotChat",
  },
  {
    title: "Next.js Boilerplate",
    description: "A production-ready Next.JS boilerplate repo for quickly starting new projects with best practices built-in. Includes TypeScript, Tailwind CSS, authentication patterns, and API utilities—start building faster.",
    tags: ["Next.js", "Boilerplate", "TypeScript", "React", "Template"],
    github: "https://github.com/kliewerdaniel/next",
  },
  {
    title: "Synth01 - News to Audio",
    description: "A privacy-focused application that transforms RSS news feeds into personalized audio broadcasts using local LLMs. Listen to your favorite news sources as natural-sounding audio summaries while keeping your data local.",
    tags: ["Local LLM", "Privacy", "Audio Generation", "RSS", "TTS"],
    github: "https://github.com/kliewerdaniel/synth01",
  },
  {
    title: "MindMap AI",
    description: "A comprehensive personal knowledge management system that builds interactive mind maps from notes using local LLMs and vector embeddings. Transform your scattered notes into interconnected knowledge graphs automatically.",
    tags: ["Knowledge Graph", "Mind Map", "Local LLM", "Vector DB", "Personal Knowledge"],
    github: "https://github.com/kliewerdaniel/mindmap03",
  },
  {
    title: "SteinBot",
    description: "An advanced AI research assistant specializing in analyzing financial data files with intelligent querying through conversational interfaces. Upload CSV, Excel, or JSON financial data and get insights through natural language.",
    tags: ["Finance AI", "Research", "Chatbot", "Document Analysis", "Data Analysis"],
    github: "https://github.com/kliewerdaniel/steinbot",
  },
  {
    title: "GraphRAGEval",
    description: "Graph RAG with vero-eval - evaluation framework for Graph-based Retrieval Augmented Generation systems. Benchmark and measure the accuracy of your GraphRAG implementations with comprehensive evaluation metrics.",
    tags: ["GraphRAG", "Evaluation", "RAG", "Research", "Benchmarking"],
    github: "https://github.com/kliewerdaniel/GraphRAGEval",
  },
  {
    title: "PersonaForge",
    description: "Persona Generation UI for creating and managing AI personas with expanded quantitative values and customization options. Design detailed AI personas with specific traits, knowledge domains, and behavioral patterns.",
    tags: ["AI Personas", "UI", "TypeScript", "React", "Persona Engineering"],
    github: "https://github.com/kliewerdaniel/personaforge04",
  },
];

export default function ProjectsPage() {
  return (
    <div className="container px-4 py-16 mx-auto min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Projects</h1>
        <p className="text-xl text-muted-foreground mb-12">
          A collection of AI/ML projects, tools, and experiments.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col bg-card border border-border hover:border-white/30 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 group">
              <CardHeader>
                <CardTitle className="group-hover:text-white transition-colors text-foreground">{project.title}</CardTitle>
                <CardDescription className="group-hover:text-muted-foreground/80 transition-colors text-muted-foreground">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary text-muted-foreground border border-border text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Link href={project.github} target="_blank" rel="noopener noreferrer">
                    <Badge variant="outline" className="cursor-pointer border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5 transition-colors">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
