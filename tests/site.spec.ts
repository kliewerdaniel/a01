import { test, expect } from '@playwright/test';

/**
 * Portfolio Site Tests
 * Comprehensive end-to-end tests for the portfolio
 */

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Daniel Kliewer/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Daniel Kliewer')).toBeVisible();
    await expect(page.getByText('Machine Learning Enthusiast')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links
    await page.click('text=View Projects');
    await expect(page).toHaveURL(/.*\/projects/);
    
    await page.goto('/');
    await page.click('text=Read Blog');
    await expect(page).toHaveURL(/.*\/blog/);
  });

  test('should display featured projects', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Featured Projects')).toBeVisible();
    await expect(page.getByText('Synthetic Intelligence')).toBeVisible();
  });

  test('should display blog posts', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Blog Posts')).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('should load blog page', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByText('Blog Posts')).toBeVisible();
  });

  test('should filter blog posts by search', async ({ page }) => {
    await page.goto('/blog');
    
    // Type in search
    const searchInput = page.getByPlaceholder(/Search/i);
    await searchInput.fill('RAG');
    await searchInput.press('Enter');
    
    // Wait for results
    await page.waitForTimeout(500);
  });

  test('should navigate to blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Click on first blog post
    const firstPost = page.locator('[class*="card"]').first();
    await firstPost.click();
    
    // Should navigate to post
    await expect(page).toHaveURL(/.*\/blog\/.*/);
  });
});

test.describe('AI Chat', () => {
  test('should have AI chat component', async ({ page }) => {
    await page.goto('/');
    
    // Check for AI chat toggle
    const chatButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    // The AI chat should be visible
    await expect(page.getByText('Technical Architect')).toBeVisible();
  });
});

test.describe('SEO', () => {
  test('should have meta description', async ({ page }) => {
    await page.goto('/');
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('should have OpenGraph tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });
});

test.describe('Performance', () => {
  test('should load quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - start;
    
    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});
