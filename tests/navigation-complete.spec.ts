import { test, expect } from '@playwright/test';

test.describe('Navigation - Complete Coverage', () => {
  test.describe('Desktop Sidebar', () => {
    test('All sidebar routes navigate correctly', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      const routes = [
        { testid: 'nav-dashboard', url: /\/app\/dashboard/, h1: /Dashboard/i },
        { testid: 'nav-estimates', url: /\/app\/estimates/, h1: /Estimates/i },
        { testid: 'nav-invoices', url: /\/app\/invoices/, h1: /Invoices/i },
        { testid: 'nav-purchase-orders', url: /\/app\/purchase-orders/, h1: /Purchase Orders/i },
        { testid: 'nav-expenses', url: /\/app\/finance\/expenses/, h1: /Expenses/i },
        { testid: 'nav-vendors', url: /\/app\/finance\/vendors/, h1: /Vendors/i },
        { testid: 'nav-financial-analytics', url: /\/app\/financial-analytics/, h1: /Financial Analytics/i },
        { testid: 'nav-jobs', url: /\/app\/jobs/, h1: /Jobs/i },
        { testid: 'nav-scheduling', url: /\/app\/scheduling/, h1: /Scheduling/i },
        { testid: 'nav-fleet', url: /\/app\/fleet/, h1: /Fleet/i },
        { testid: 'nav-teams', url: /\/app\/teams/, h1: /Teams/i },
        { testid: 'nav-clients', url: /\/app\/client-portal/, h1: /Client Portal/i },
        { testid: 'nav-client-reports', url: /\/app\/client-reports/, h1: /Client Reports/i },
        { testid: 'nav-analytics', url: /\/app\/analytics/, h1: /Analytics/i },
        { testid: 'nav-job-performance', url: /\/app\/job-performance/, h1: /Job Performance/i },
        { testid: 'nav-team-performance', url: /\/app\/team-performance/, h1: /Team Performance/i },
        { testid: 'nav-company', url: /\/app\/company/, h1: /Company/i },
        { testid: 'nav-settings', url: /\/app\/settings/, h1: /Settings/i },
      ];
      
      for (const route of routes) {
        await page.getByTestId(route.testid).click();
        await expect(page).toHaveURL(route.url);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(route.h1);
      }
    });

    test('Sidebar active state highlights current route', async ({ page }) => {
      await page.goto('/app/invoices');
      
      // Check that invoices nav item has active styling
      const invoicesNav = page.getByTestId('nav-invoices');
      await expect(invoicesNav).toHaveClass(/bg-primary/);
      
      // Navigate to another route
      await page.getByTestId('nav-estimates').click();
      const estimatesNav = page.getByTestId('nav-estimates');
      await expect(estimatesNav).toHaveClass(/bg-primary/);
      
      // Previous route should not be active
      await expect(invoicesNav).not.toHaveClass(/bg-primary/);
    });

    test('Sidebar groups expand/collapse', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Finance group should be collapsible
      const financeGroup = page.getByText('Finance').first();
      await financeGroup.click();
      
      // Check if items are visible
      await expect(page.getByTestId('nav-estimates')).toBeVisible();
      
      // Collapse again
      await financeGroup.click();
      await page.waitForTimeout(300); // Wait for animation
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
    });

    test('Mobile menu opens and routes correctly', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Open mobile menu
      await page.getByRole('button', { name: /open navigation menu/i }).click();
      
      // Check menu is visible
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Navigate to invoices
      await page.getByText('Invoices').click();
      await expect(page).toHaveURL(/\/app\/invoices/);
      
      // Menu should close after navigation
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('Mobile menu closes on Escape key', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Open menu
      await page.getByRole('button', { name: /open navigation menu/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Menu should close
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('Mobile menu shows active route', async ({ page }) => {
      await page.goto('/app/estimates');
      
      // Open menu
      await page.getByRole('button', { name: /open navigation menu/i }).click();
      
      // Check estimates is highlighted
      const estimatesLink = page.getByRole('link', { name: /Estimates/i });
      await expect(estimatesLink).toHaveClass(/bg-primary/);
    });
  });

  test.describe('Breadcrumbs', () => {
    test('Shows correct trail on detail pages', async ({ page }) => {
      // Navigate to a nested page
      await page.goto('/app/finance/expenses');
      
      // Check breadcrumb trail
      const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
      await expect(breadcrumbs).toContainText('Dashboard');
      await expect(breadcrumbs).toContainText('Finance');
      await expect(breadcrumbs).toContainText('Expenses');
      
      // Click home breadcrumb
      await breadcrumbs.getByRole('link').first().click();
      await expect(page).toHaveURL(/\/app\/dashboard/);
    });

    test('Breadcrumbs not shown on dashboard', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Breadcrumbs should not be visible on dashboard
      const breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
      await expect(breadcrumbs).not.toBeVisible();
    });
  });

  test.describe('Quick Actions', () => {
    test('All quick actions route correctly', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      const actions = [
        { testid: 'qa-create-job', url: /\/app\/jobs\/create/ },
        { testid: 'qa-new-po', url: /\/app\/purchase-orders\/create/ },
        { testid: 'qa-track-contractors', url: /\/app\/contractors\/tracking/ },
        { testid: 'qa-manage-expenses', url: /\/app\/finance\/expenses/ },
        { testid: 'qa-client-messages', url: /\/app\/client-portal/ },
        { testid: 'qa-fleet-management', url: /\/app\/fleet/ },
      ];
      
      for (const action of actions) {
        await page.goto('/app/dashboard');
        await page.getByTestId(action.testid).click();
        await expect(page).toHaveURL(action.url);
      }
    });
  });

  test.describe('404 Fallback', () => {
    test('Shows 404 page for invalid routes', async ({ page }) => {
      await page.goto('/invalid-route-xyz');
      
      await expect(page.getByText('404')).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
      
      // Check CTAs exist
      await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Browse Jobs/i })).toBeVisible();
    });

    test('404 page CTAs work correctly', async ({ page }) => {
      await page.goto('/invalid-route');
      
      // Click return to dashboard
      await page.getByRole('link', { name: /Dashboard/i }).click();
      await expect(page).toHaveURL(/\/app\/dashboard/);
    });
  });

  test.describe('Legacy Redirects', () => {
    test('Old URLs redirect to new ones', async ({ page }) => {
      const redirects = [
        { from: '/finance/po', to: /\/app\/purchase-orders/ },
        { from: '/app/quotes', to: /\/app\/estimates/ },
        { from: '/jobs/new', to: /\/app\/jobs\/create/ },
        { from: '/app/crew', to: /\/app\/teams/ },
        { from: '/dashboard', to: /\/app\/dashboard/ },
      ];
      
      for (const redirect of redirects) {
        await page.goto(redirect.from);
        await expect(page).toHaveURL(redirect.to);
      }
    });
  });

  test.describe('Portal Links', () => {
    test('Estimate portal loads with token', async ({ page }) => {
      const testToken = 'test-estimate-token-123';
      await page.goto(`/portal/estimate/${testToken}`);
      
      // Should not 404
      await expect(page.getByText('404')).not.toBeVisible();
      // Should show estimate content or loading
      await expect(page.locator('body')).toContainText(/Estimate|Loading/i);
    });

    test('Invoice portal loads with token', async ({ page }) => {
      const testToken = 'test-invoice-token-456';
      await page.goto(`/portal/invoice/${testToken}`);
      
      // Should not 404
      await expect(page.getByText('404')).not.toBeVisible();
      // Should show invoice content or loading
      await expect(page.locator('body')).toContainText(/Invoice|Loading/i);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('Tab order works through navigation', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Start tabbing
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check focus is on navigation elements
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      expect(focusedElement).toBeTruthy();
    });

    test('Menu items are keyboard accessible', async ({ page }) => {
      await page.goto('/app/dashboard');
      
      // Tab to first nav item
      const firstNavItem = page.getByTestId('nav-dashboard');
      await firstNavItem.focus();
      
      // Press Enter to navigate
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/app\/dashboard/);
    });
  });

  test.describe('List to Detail Navigation', () => {
    test('Job list row navigates to detail', async ({ page }) => {
      await page.goto('/app/jobs');
      
      // If there are job rows, click one
      const jobRows = page.locator('[data-testid^="job-row-"]');
      const count = await jobRows.count();
      
      if (count > 0) {
        await jobRows.first().click();
        await expect(page).toHaveURL(/\/app\/jobs\/[^/]+$/);
      }
    });

    test('Estimate list row navigates to detail', async ({ page }) => {
      await page.goto('/app/estimates');
      
      // If there are estimate rows, click one
      const estimateRows = page.locator('[data-testid^="estimate-row-"]');
      const count = await estimateRows.count();
      
      if (count > 0) {
        await estimateRows.first().click();
        await expect(page).toHaveURL(/\/app\/estimates\/[^/]+$/);
      }
    });
  });

  test.describe('External Links', () => {
    test('External links have correct attributes', async ({ page }) => {
      await page.goto('/');
      
      // API link should open in new tab
      const apiLink = page.getByRole('link', { name: /API/i });
      if (await apiLink.isVisible()) {
        await expect(apiLink).toHaveAttribute('target', '_blank');
        await expect(apiLink).toHaveAttribute('rel', /noopener/);
      }
    });
  });
});