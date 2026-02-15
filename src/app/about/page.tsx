'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, GraduationCap, Briefcase, Heart, Sparkles, Code, Brain, Globe, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 mx-auto max-w-4xl min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>About Me</h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI Developer & Full-Stack Technologist based in Austin, Texas
        </p>
      </motion.div>
      
      <div className="space-y-8">
        {/* Quick Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card border border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Austin, Texas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>10+ years in data annotation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>RLHF Expert</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Who I Am */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Who I Am
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                I'm Daniel Kliewer, an AI Developer and Full-Stack Technologist operating at the critical 
                intersection of human alignment, decentralized AI architectures, and high-integrity data systems.
              </p>
              <p className="text-muted-foreground">
                With a professional background spanning over a decade in rigorous data annotation methodologies 
                and self-taught mastery of modern software engineering, I specialize in transforming complex 
                human data—such as psychological traits and writing styles—into quantifiable, machine-readable formats.
              </p>
              <p className="text-muted-foreground">
                My work is driven by a commitment to <strong className="text-foreground">local-first computing</strong> 
                (Loco LLMs), prioritizing data privacy, computational sovereignty, and cost-effective deployment 
                over reliance on proprietary cloud services.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Independent Developer & Annotator</h3>
                <p className="text-muted-foreground mb-2">Austin, TX • 2022 - Present</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                  <li><strong className="text-foreground">RLHF Expert:</strong> Over a decade of experience in high-integrity data annotation, including foundational work on Amazon Mechanical Turk (pre-iPhone era) and contracts for major tech companies</li>
                  <li><strong className="text-foreground">Model Alignment & QA:</strong> Contributed directly to RLHF pipelines by providing human ranking and feedback on model outputs, training reward models for helpfulness, harmlessness, and truthfulness</li>
                  <li><strong className="text-foreground">Multimodal Data Processing:</strong> Annotated complex datasets including video feeds from AR-integrated devices, transforming raw perception into structured linguistic intelligence</li>
                </ul>
              </div>
              <Separator className="bg-border" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Fine Arts Professional and Web Designer (Freelance)</h3>
                <p className="text-muted-foreground mb-2">January 2010 - Present</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                  <li>Developed and maintained multiple digital presences (danielkliewer.com, kadaligogh.com, eastsidechess.org)</li>
                  <li>Produced experimental film and digital art displayed at Austin Film Society's Avant Cinema program and Co-Lab Projects (2012)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education & Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">B.A. in History</h3>
                <p className="text-muted-foreground text-sm">University of Mary Hardin-Baylor • Belton, TX • 2003 - 2007</p>
              </div>
              <Separator className="bg-border" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Self-Taught Mastery</h3>
                <p className="text-muted-foreground text-sm">
                  Developed strong theoretical foundations in linear algebra, advanced probability/statistics, 
                  data structures, and algorithms through rigorous self-study using MIT OpenCourseWare and Harvard edX.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                  MIT OpenCourseWare
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                  Harvard edX
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                  Self-Study
                </Badge>
                <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                  Hands-on Projects
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Community Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Award className="w-5 h-5" />
                Community Leadership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Founder, Loco LLM Community</strong> — Promoting open-source AI development and community collaboration
                </li>
                <li>
                  <strong className="text-foreground">Organizer, Loco LLM Hackathons</strong> — Leading global hackathons focused on building open-source AI tools with local LLMs
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Code className="w-5 h-5" />
                Key Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">PersonaGen (Quantified Persona Generator)</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  A full-stack application leveraging local LLMs (Ollama) to analyze writing samples and generate 
                  a detailed 50-metric JSON persona profile for style-cloned content generation.
                </p>
                <p className="text-muted-foreground text-sm">
                  Uses recursive chain construction via LangChain/LangGraph with ChromaDB vector storage 
                  and SQLite for persistent persona evolution.
                </p>
              </div>
              <Separator className="bg-border" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Tech Company Orchestrator</h3>
                <p className="text-muted-foreground text-sm">
                  Open-source guide detailing documentation-driven development workflows for creating technology 
                  companies using AI agents with NetworkX graph structures.
                </p>
              </div>
              <Separator className="bg-border" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Insight Journal Platform</h3>
                <p className="text-muted-foreground text-sm">
                  Privacy-focused journaling system integrating locally hosted LLMs (Ollama) for personalized 
                  feedback, keeping data out of commercial cloud platforms.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Technical Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Python",
                  "TypeScript",
                  "Next.js",
                  "React",
                  "Ollama",
                  "LangChain",
                  "LangGraph",
                  "ChromaDB",
                  "Vector Databases",
                  "RAG",
                  "AI Agents",
                  "OpenAI API",
                  "Tailwind CSS",
                  "FastAPI",
                  "Docker",
                  "Django",
                  "PostgreSQL",
                  "RLHF",
                  "Persona Modeling",
                  "MCP Protocol"
                ].map((tech, index) => (
                  <motion.div 
                    key={tech} 
                    className="flex items-center text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 + index * 0.02 }}
                  >
                    <span className="w-2 h-2 bg-foreground rounded-full mr-2" />
                    {tech}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What I Care About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5" />
                What I Care About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Local-First Computing</strong> — Running models on personal hardware with Ollama and llama.cpp. 
                  Privacy, cost savings, and customization through local inference.
                </li>
                <li>
                  <strong className="text-foreground">Data Sovereignty</strong> — Building systems where data doesn't leave your control. 
                  Your personal knowledge and AI assistants should remain under your control.
                </li>
                <li>
                  <strong className="text-foreground">Human Alignment</strong> — Working on RLHF and model alignment to ensure AI systems 
                  are helpful, harmless, and truthful.
                </li>
                <li>
                  <strong className="text-foreground">Open Source Community</strong> — Founder of Loco LLM Community, organizing hackathons 
                  and promoting collaborative AI development.
                </li>
                <li>
                  <strong className="text-foreground">Practical Solutions</strong> — Building things that actually work and solve real problems. 
                  Elegant over complex.
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">When I'm Not Coding</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Producing experimental film and digital art</li>
                <li>Hiking and exploring the Texas outdoors</li>
                <li>Reading about AI alignment, philosophy of mind, and consciousness</li>
                <li>Community organizing for open-source AI development</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Separator className="my-8 bg-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">
            Want to connect or collaborate? I'd love to hear from you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:danielkliewer@gmail.com" className="text-foreground hover:text-white transition-colors">
              danielkliewer@gmail.com
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="https://github.com/kliewerdaniel" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-white transition-colors">
              GitHub
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="https://www.linkedin.com/in/daniel-kliewer-42691944/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
