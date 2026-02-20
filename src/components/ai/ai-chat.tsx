'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, 
  User, 
  Send, 
  Sparkles, 
  X, 
  ChevronDown,
  Settings,
  MessageSquare,
  Code,
  Brain,
  Users,
  BookOpen,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { personas, type Persona } from '@/lib/ai/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Chat message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export function AIChat({ 
  className,
  defaultPersona = 'engineer'
}: { 
  className?: string;
  defaultPersona?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm the Technical Architect for Daniel's portfolio. I can help you explore his blog posts, explain the site architecture, or discuss AI/ML topics. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>(defaultPersona);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: 'loading-' + Date.now(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
          personaId: selectedPersona
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        
        // Update the loading message with streaming content
        setMessages(prev => prev.map(m => 
          m.id === loadingMessage.id 
            ? { ...m, content: fullResponse, isLoading: false }
            : m
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Check if it's a demo mode response (when Ollama is not available)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      let fallbackContent = "I apologize, but I encountered an error. Please try again.";
      
      // If the error indicates Ollama is not available, provide a helpful message
      if (errorMessage.includes('Failed to get response') || errorMessage.includes('Network Error')) {
        fallbackContent = "I couldn't connect to the AI service. This might be because Ollama isn't running locally. The chat will work once Ollama is started, or you can try again in a moment.";
      }
      
      setMessages(prev => prev.map(m => 
        m.id === loadingMessage.id 
          ? { ...m, content: fallbackContent, isLoading: false }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Chat cleared! How can I help you?",
      timestamp: Date.now()
    }]);
  };

  return (
    <Card className={cn("border border-border bg-card/95 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-foreground/10">
              <Brain className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Technical Architect
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                AI Assistant
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map(persona => (
                  <SelectItem key={persona.id} value={persona.id} className="text-xs">
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Persona indicator */}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs bg-secondary/50">
            {personas.find(p => p.id === selectedPersona)?.name || 'General'}
          </Badge>
          {selectedPersona === 'engineer' && <Code className="w-3 h-3 text-muted-foreground" />}
          {selectedPersona === 'recruiter' && <Users className="w-3 h-3 text-muted-foreground" />}
          {selectedPersona === 'researcher' && <BookOpen className="w-3 h-3 text-muted-foreground" />}
        </div>
      </CardHeader>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[300px] overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-foreground" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2",
                        message.role === 'user' 
                          ? "bg-foreground text-background" 
                          : "bg-secondary/50 text-foreground"
                      )}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-background" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the site, skills, projects..."
                    className="flex-1 bg-background border-border"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Compact version for embedding in pages
export function AIChatCompact({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      {/* Toggle button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 z-50"
          >
            <AIChat className="shadow-2xl" />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
