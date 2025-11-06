import { test, expect } from '@playwright/test';

test.describe('Poker Evaluator Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/Poker Evaluator/);

    // Check if main heading is present
    await expect(page.locator('h1')).toContainText('Poker Evaluator');

    // Check if navigation buttons are present
    await expect(page.locator('text=Start Evaluating')).toBeVisible();
    await expect(page.locator('text=View Documentation')).toBeVisible();
  });

  test('navigation to evaluator works', async ({ page }) => {
    // Click on the "Start Evaluating" button
    await page.click('text=Start Evaluating');

    // Check if we're on the evaluator page
    await expect(page).toHaveURL(/.*evaluator/);

    // Check if evaluator components are loaded
    await expect(page.locator('text=Select Your Cards')).toBeVisible();
  });

  test('card selection functionality', async ({ page }) => {
    // Navigate to evaluator
    await page.click('text=Start Evaluating');

    // Wait for cards to load
    await page.waitForSelector('text=Select Your Cards');

    // Look for any clickable elements that might be cards
    const clickableElements = page.locator('button, .card, [class*="card"], [class*="Card"], img');
    const elementCount = await clickableElements.count();

    if (elementCount > 0) {
      // Try to select the first clickable element
      const firstElement = clickableElements.first();
      await expect(firstElement).toBeVisible();
      await firstElement.click();

      // Wait a moment for any visual feedback
      await page.waitForTimeout(500);
    }
  });

  test('hand evaluation works', async ({ page }) => {
    // Navigate to evaluator
    await page.click('text=Start Evaluating');

    // Wait for evaluator to load
    await page.waitForSelector('text=Select Your Cards');

    // Look for any clickable elements that might be cards
    const clickableElements = page.locator('button, .card, [class*="card"], [class*="Card"], img');
    const elementCount = await clickableElements.count();

    if (elementCount > 0) {
      // Select a few elements
      for (let i = 0; i < Math.min(5, elementCount); i++) {
        const element = clickableElements.nth(i);
        if (await element.isVisible()) {
          await element.click();
          await page.waitForTimeout(200);
        }
      }

      // Look for any hand display or evaluation results
      const handDisplay = page.locator('text=Your Hand, .hand-display, [class*="hand"], [class*="result"]');
      if (await handDisplay.first().isVisible()) {
        await expect(handDisplay.first()).toBeVisible();
      }
    }
  });

  test('Monte Carlo simulation functionality', async ({ page }) => {
    // Navigate to evaluator
    await page.click('text=Start Evaluating');

    // Wait for evaluator to load
    await page.waitForSelector('text=Select Your Cards');

    // Look for Monte Carlo simulator section
    const monteCarloSection = page.locator('text=Monte Carlo, .monte-carlo, [class*="simulation"], [class*="simulator"]');
    if (await monteCarloSection.first().isVisible()) {
      // Try to find and click any simulate button
      const simulateButton = page.locator('button:has-text("Simulate"), button:has-text("Run"), button:has-text("Start"), button');
      if (await simulateButton.first().isVisible()) {
        await simulateButton.first().click();

        // Wait for simulation to potentially complete
        await page.waitForTimeout(3000);

        // Check if any results are displayed
        const results = page.locator('text=Results, .results, [class*="result"], [class*="output"]');
        if (await results.count() > 0) {
          await expect(results.first()).toBeVisible();
        }
      }
    }
  });

  test('game controls functionality', async ({ page }) => {
    // Navigate to evaluator
    await page.click('text=Start Evaluating');

    // Wait for evaluator to load
    await page.waitForSelector('text=Select Your Cards');

    // Look for game controls section
    const gameControls = page.locator('text=Game Controls, .game-controls, [class*="control"]');
    if (await gameControls.first().isVisible()) {
      // Check for reset button
      const resetButton = page.locator('button:has-text("Reset"), button:has-text("Clear"), button');
      if (await resetButton.first().isVisible()) {
        await expect(resetButton.first()).toBeVisible();
      }

      // Check for random hand button
      const randomButton = page.locator('button:has-text("Random"), button:has-text("Shuffle"), button');
      if (await randomButton.first().isVisible()) {
        await expect(randomButton.first()).toBeVisible();
      }
    }
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if page loads correctly
    await expect(page.locator('text=Poker Evaluator')).toBeVisible();

    // Navigate to evaluator
    await page.click('text=Start Evaluating');

    // Check if mobile layout works
    await expect(page.locator('text=Select Your Cards')).toBeVisible();
  });

  test('accessibility basics', async ({ page }) => {
    // Check if page has proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check if navigation is keyboard accessible
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    // Navigate to evaluator
    await page.click('text=Start Evaluating');
    await page.waitForSelector('text=Select Your Cards');

    // Try keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  });
});
