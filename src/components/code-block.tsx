'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Extract text content from the code element
  const getCodeText = useCallback(() => {
    if (typeof children === 'string') {
      return children;
    }
    // Handle React elements
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (!node) return '';
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (typeof node === 'object' && node !== null && 'props' in node) {
        const element = node as React.ReactElement<{ children?: React.ReactNode }>;
        return extractText(element.props.children);
      }
      return '';
    };
    return extractText(children);
  }, [children]);

  const handleCopy = async () => {
    const codeText = getCodeText();
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      {/* Copy button - positioned top right */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        className={`absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8
          bg-secondary/80 hover:bg-secondary backdrop-blur-sm
          dark:bg-secondary/60 dark:hover:bg-secondary
          border border-border/50`}
        aria-label={isCopied ? 'Copied!' : 'Copy code'}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      
      {/* Code block with word wrap */}
      <code className={`${className || ''} break-all whitespace-pre-wrap`}>
        {children}
      </code>
    </div>
  );
}
