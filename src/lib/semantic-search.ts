import { getBlogPosts, BlogPost } from './blog';

// Interface for embedded blog posts
export interface EmbeddedPost {
  slug: string;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  embedding?: number[];
}

// Simple hash function to generate pseudo-embeddings (for fallback)
// In production, you'd use Ollama's embedding API
function simpleHash(str: string): number[] {
  const hash: number[] = [];
  for (let i = 0; i < 384; i++) {
    hash.push(0);
  }
  
  // Simple tokenization and hashing
  const words = str.toLowerCase().split(/\s+/);
  words.forEach((word, idx) => {
    let hashVal = 0;
    for (let i = 0; i < word.length; i++) {
      hashVal = ((hashVal << 5) - hashVal) + word.charCodeAt(i);
      hashVal = hashVal & hashVal;
    }
    // Spread influence across the vector
    const pos1 = Math.abs(hashVal) % 384;
    const pos2 = (Math.abs(hashVal) + 31) % 384;
    const pos3 = (Math.abs(hashVal) + 127) % 384;
    hash[pos1] += 1;
    hash[pos2] += 0.5;
    hash[pos3] += 0.25;
  });
  
  // Normalize
  const mag = Math.sqrt(hash.reduce((sum, v) => sum + v * v, 0));
  return hash.map(v => v / (mag || 1));
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}

// Generate embedding for text using Ollama (with fallback)
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Try to use Ollama API if available
    const response = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.embedding;
    }
  } catch (error) {
    console.log('Ollama not available, using fallback embedding');
  }
  
  // Fallback to simple hash-based embeddings
  return simpleHash(text);
}

// Cache for embeddings
let embeddingsCache: Map<string, number[]> = new Map();

// Get or generate embedding for a post
async function getEmbeddingForPost(post: EmbeddedPost): Promise<number[]> {
  const cacheKey = post.slug;
  
  if (embeddingsCache.has(cacheKey)) {
    return embeddingsCache.get(cacheKey)!;
  }
  
  // Combine title, description, and content for embedding
  const text = `${post.title} ${post.description || ''} ${post.content.slice(0, 2000)}`;
  const embedding = await generateEmbedding(text);
  
  embeddingsCache.set(cacheKey, embedding);
  return embedding;
}

// Clear embeddings cache
export function clearEmbeddingsCache(): void {
  embeddingsCache.clear();
}

// Search posts by semantic similarity
export async function semanticSearch(
  query: string,
  posts: BlogPost[],
  limit: number = 5
): Promise<BlogPost[]> {
  if (!query.trim() || posts.length === 0) {
    return [];
  }
  
  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  
  // Get embeddings for all posts and calculate similarities
  const postsWithScores: { post: BlogPost; score: number }[] = [];
  
  for (const post of posts) {
    const postEmbedding = await getEmbeddingForPost({
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      tags: post.tags,
    });
    
    const score = cosineSimilarity(queryEmbedding, postEmbedding);
    postsWithScores.push({ post, score });
  }
  
  // Sort by similarity score (descending) and return top results
  return postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

// Get related posts based on content similarity
export async function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): Promise<BlogPost[]> {
  // Filter out the current post
  const otherPosts = allPosts.filter(p => p.slug !== currentPost.slug);
  
  if (otherPosts.length === 0) {
    return [];
  }
  
  // Create a search query from current post's title and tags
  const query = [
    currentPost.title,
    ...(currentPost.tags || []),
    currentPost.description || '',
  ].join(' ');
  
  // Use semantic search to find related posts
  return semanticSearch(query, otherPosts, limit);
}
