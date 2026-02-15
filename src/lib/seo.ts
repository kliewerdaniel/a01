/**
 * Advanced SEO Configuration
 * Comprehensive metadata for search engines and social sharing
 */

import { Metadata } from 'next';

export const siteConfig = {
  name: 'Daniel Kliewer',
  title: 'Daniel Kliewer | Software Engineer & AI Practitioner',
  description: 'Software Engineer & AI Practitioner based in Austin, Texas building with LLMs, autonomous agents, and local-first AI systems. Passionate about data sovereignty and privacy-focused AI.',
  url: 'https://danielkliewer.com',
  ogImage: '/og-image.png',
  twitterHandle: '@danielkliewer',
  author: {
    name: 'Daniel Kliewer',
    url: 'https://danielkliewer.com',
    email: 'daniel@danielkliewer.com'
  },
  keywords: [
    'AI', 'LLM', 'RAG', 'Software Engineer', 'Machine Learning',
    'Next.js', 'React', 'Python', 'TypeScript',
    'Local LLM', 'Ollama', 'Autonomous Agents',
    'Data Sovereignty', 'Privacy-Focused AI',
    'Knowledge Graphs', 'GraphRAG',
    'Austin', 'Texas', 'Freelance'
  ],
  categories: [
    'technology',
    'software development',
    'artificial intelligence',
    'machine learning'
  ]
};

export const structuredData = {
  person: {
    '@type': 'Person',
    name: 'Daniel Kliewer',
    url: siteConfig.url,
    jobTitle: 'Software Engineer & AI Practitioner',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Austin',
      addressRegion: 'TX',
      addressCountry: 'US'
    },
    sameAs: [
      'https://github.com/kliewerdaniel',
      'https://linkedin.com/in/danielkliewer'
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Autonomous Agents',
      'Next.js',
      'React',
      'Python'
    ]
  },
  website: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/blog?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  },
  blog: {
    '@type': 'Blog',
    name: 'Technical Blog',
    url: `${siteConfig.url}/blog`,
    description: 'Technical articles on AI, LLMs, and software development'
  }
};

export function generateMetadata(pageTitle?: string, pageDescription?: string): Metadata {
  const title = pageTitle 
    ? `${pageTitle} | ${siteConfig.name}` 
    : siteConfig.title;
  
  const description = pageDescription || siteConfig.description;
  const canonical = pageTitle 
    ? `${siteConfig.url}/${pageTitle.toLowerCase().replace(/\s+/g, '-')}`
    : siteConfig.url;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: siteConfig.keywords,
    category: 'technology',
    
    // Canonical URL
    alternates: {
      canonical,
      languages: {
        'en-US': canonical
      }
    },
    
    // OpenGraph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: [siteConfig.ogImage]
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    
    // Authors
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    
    // Verification
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code'
    },
    
    // Other
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    itunes: {
      appId: '123456789'
    },
    appLinks: {
      ios: {
        url: 'https://apps.apple.com/app/id123456789',
        app_store_id: '123456789'
      },
      android: {
        package: 'com.danielkliewer.app',
        app_name: 'Daniel Kliewer'
      }
    }
  };
}

// Generate JSON-LD structured data
export function generateJSONLD(pageType: 'website' | 'article' | 'person' = 'website') {
  switch (pageType) {
    case 'person':
      return JSON.stringify(structuredData.person);
    case 'article':
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: siteConfig.title,
        description: siteConfig.description,
        author: structuredData.person,
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        image: siteConfig.ogImage,
        url: siteConfig.url
      });
    default:
      return JSON.stringify([
        structuredData.website,
        structuredData.person
      ]);
  }
}
