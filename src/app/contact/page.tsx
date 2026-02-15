'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter, Mail, MapPin, Clock, Zap, MessageSquare, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="container px-4 py-16 mx-auto max-w-4xl min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Get In Touch</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Let's connect and build something amazing together
        </p>
      </motion.div>
      
      <div className="space-y-8">
        {/* Location & Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-card border border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Austin, Texas</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>UTC-6 (CST)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>Usually responds within 24 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Let's Connect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Let's Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                I'm always interested in hearing about new projects, opportunities, and ideas. 
                Whether you want to collaborate on something, have a question about AI/ML development, 
                or just want to say hi, feel free to reach out!
              </p>
              <p className="text-muted-foreground">
                I'm currently <strong className="text-foreground">available for freelance projects</strong> and 
                consulting work, particularly in the AI/ML space. I'm also open to full-time opportunities 
                that align with my interests in local-first AI, privacy-focused systems, and autonomous agents.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Find Me On</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="https://github.com/kliewerdaniel" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5 transition-colors">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/daniel-kliewer-42691944/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5 transition-colors">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                </Link>
                <Link href="https://x.com/kliewer_daniel" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5 transition-colors">
                    <Twitter className="mr-2 h-4 w-4" />
                    X (Twitter)
                  </Button>
                </Link>
                <Link href="mailto:danielkliewer@gmail.com">
                  <Button variant="outline" className="w-full border-border text-muted-foreground hover:border-white hover:text-white hover:bg-white/5 transition-colors">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What I Can Help With */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5" />
                What I Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">AI/ML Development</h4>
                      <p className="text-sm text-muted-foreground">Building custom AI solutions with LLMs, RAG, and autonomous agents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Agent Systems</h4>
                      <p className="text-sm text-muted-foreground">Designing and implementing multi-agent architectures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Knowledge Management</h4>
                      <p className="text-sm text-muted-foreground">RAG pipelines, knowledge graphs, and document processing systems</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Local AI Setup</h4>
                      <p className="text-sm text-muted-foreground">Deploying private AI systems with Ollama and local models</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Github className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Full-Stack Development</h4>
                      <p className="text-sm text-muted-foreground">Next.js, React, Python, TypeScript, and cloud infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-foreground mt-1" />
                    <div>
                      <h4 className="font-medium text-foreground">Technical Writing</h4>
                      <p className="text-sm text-muted-foreground">Documentation, tutorials, and technical content creation</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferred Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Preferred Contact Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                    Best
                  </Badge>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Email</strong> — danielkliewer@gmail.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                    Good
                  </Badge>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">LinkedIn</strong> — For professional inquiries and networking
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-secondary text-muted-foreground border border-border">
                    Casual
                  </Badge>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">X/Twitter</strong> — For quick updates and tech discussions
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>A response within 24-48 hours (usually faster)</li>
                <li>An honest assessment of project feasibility and approach</li>
                <li>Clear communication about timeline and expectations</li>
                <li>Flexible engagement models for different project sizes</li>
                <li>Focus on practical solutions that solve real problems</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invitation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-8"
        >
          <p className="text-lg text-muted-foreground mb-4">
            Whether you have a project in mind, want to collaborate, or just want to chat about AI—I'm here for it.
          </p>
          <p className="text-foreground font-medium">
            Don't be a stranger. Reach out and let's create something cool together.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
