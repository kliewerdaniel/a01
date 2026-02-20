'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, 
  User, 
  Send, 
  Sparkles, 
  X,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Chat message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
  error?: boolean;
}

// Suggested prompts - categorized by perspective
const suggestedPrompts = [
  { label: "Technical deep-dive", query: "Explain the technical architecture in detail with code examples" },
  { label: "Quick overview", query: "Give me a quick summary of what Daniel builds" },
  { label: "Research perspective", query: "What research papers or theories inform his work?" },
  { label: "Skills & experience", query: "What are Daniel's technical skills and experience?" },
  { label: "Blog posts", query: "Show me his blog posts about AI and LLMs" },
  { label: "How it works", query: "How does the knowledge graph / RAG system work?" }
];

export function AIChat({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Daniel's AI assistant for this portfolio. I can help you explore his blog posts, explain the site architecture, discuss his AI/ML projects, or answer any questions about his work. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/chat', { method: 'GET' });
        const data = await response.json();
        setIsConnected(data.status !== 'demo_mode');
      } catch {
        setIsConnected(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

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
          ]
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
        
        setMessages(prev => prev.map(m => 
          m.id === loadingMessage.id 
            ? { ...m, content: fullResponse, isLoading: false }
            : m
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      let fallbackContent = "I apologize, but I encountered an error. Please try again.";
      
      if (errorMessage.includes('Failed to get response') || errorMessage.includes('Network Error')) {
        fallbackContent = "I couldn't connect to the AI service. This might be because Ollama isn't running locally. The chat will work once Ollama is started, or you can try again in a moment.";
        setIsConnected(false);
      }
      
      setMessages(prev => prev.map(m => 
        m.id === loadingMessage.id 
          ? { ...m, content: fallbackContent, isLoading: false, error: true }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Portfolio Assistant</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
              {isConnected ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
              message.role === 'user' 
                ? "bg-foreground" 
                : "bg-gradient-to-br from-primary/80 to-primary"
            )}>
              {message.role === 'user' ? (
                <User className="w-3.5 h-3.5 text-background" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              )}
            </div>
            
            {/* Message Bubble */}
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 relative group",
              message.role === 'user' 
                ? "bg-foreground text-background rounded-tr-sm" 
                : "bg-[#f5f5f5] !text-black rounded-tl-sm"
            )}>
              {message.isLoading ? (
                <div className="flex items-center gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap !text-black">{message.content}</p>
              )}
              
              {/* Copy button for assistant messages */}
              {message.role === 'assistant' && !message.isLoading && (
                <button
                  onClick={() => copyMessage(message.id, message.content)}
                  className="absolute -top-6 right-0 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-foreground bg-background/80 rounded-md backdrop-blur-sm"
                  title="Copy"
                >
                  {copiedMessageId === message.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              
              {message.error && (
                <span className="text-xs text-red-500 mt-1 block">Error</span>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(prompt.query)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Floating chat button + panel
export function AIChatWidget({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    // Reset chat context by changing the key to force remount
    setChatKey(prev => prev + 1);
    setIsOpen(true);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-[9999]", className)}>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={handleOpen}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-2 border-white/20"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-white/30 opacity-75" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-[90vw] md:w-[700px] lg:w-[800px] h-[80vh] md:h-[700px] rounded-2xl shadow-2xl border border-border/50 bg-background overflow-hidden"
          >
            <AIChat key={chatKey} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline chat for embedding in pages
export function AIChatInline({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-4xl mx-auto rounded-2xl border border-border/50 shadow-lg overflow-hidden", className)}>
      <AIChat className="h-[500px] md:h-[600px]" />
    </div>
  );
}

// Backward compatibility alias
export const AIChatCompact = AIChatWidget;
export const AIChatEmbedded = AIChatInline;
