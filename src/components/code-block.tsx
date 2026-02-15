'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-toml';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

// Map common language aliases to Prism language names
const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  rb: 'ruby',
  rs: 'rust',
  go: 'go',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  shell: 'bash',
  sql: 'sql',
  html: 'javascript', // HTML not available, use JS
  css: 'css',
  scss: 'scss',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  dockerfile: 'docker',
  toml: 'toml',
  diff: 'bash',
  text: 'javascript',
};

// Get language from className
function getLanguage(className?: string): string | null {
  if (!className) return null;
  const match = /language-(\w+)/.exec(className);
  if (match) {
    const lang = match[1].toLowerCase();
    return languageMap[lang] || lang;
  }
  return null;
}

// Extract text content
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractText(element.props.children);
  }
  return '';
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  const language = useMemo(() => getLanguage(className), [className]);
  const codeText = useMemo(() => extractText(children), [children]);

  useEffect(() => {
    if (language && codeText) {
      const grammar = Prism.languages[language];
      if (grammar) {
        const highlighted = Prism.highlight(codeText, grammar, language);
        setHighlightedCode(highlighted);
      } else {
        setHighlightedCode(codeText);
      }
    } else {
      setHighlightedCode(codeText);
    }
  }, [language, codeText]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [codeText]);

  const displayLanguage = useMemo(() => {
    if (!language) return null;
    const names: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      jsx: 'JSX',
      tsx: 'TSX',
      python: 'Python',
      ruby: 'Ruby',
      rust: 'Rust',
      go: 'Go',
      bash: 'Bash',
      shell: 'Shell',
      sql: 'SQL',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      yaml: 'YAML',
      markdown: 'Markdown',
      docker: 'Dockerfile',
      toml: 'TOML',
    };
    return names[language] || language;
  }, [language]);

  return (
    <div className="relative group my-6">
      {/* Language label and copy button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-zinc-800/80 dark:bg-zinc-900/80 rounded-t-lg border-b border-border/50 z-10">
        {displayLanguage && (
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {displayLanguage}
          </span>
        )}
        <span className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="h-7 w-7 hover:bg-zinc-700/50"
          aria-label={isCopied ? 'Copied!' : 'Copy code'}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-zinc-400" />
          )}
        </Button>
      </div>
      
      {/* Code block with syntax highlighting */}
      <pre className="block pt-12 pb-4 px-4 bg-zinc-950 dark:bg-zinc-900 rounded-lg overflow-x-auto">
        <code 
          className={className}
          dangerouslySetInnerHTML={{ __html: highlightedCode || codeText }}
        />
      </pre>
    </div>
  );
}
