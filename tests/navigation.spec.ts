import { test, expect } from '@playwright/test';

test.describe('Navigation wires', () => {
  test('Sidebar routes open correctly', async ({ page }) => {
    await page.goto('/app/dashboard');
    
    const clicks = [
      { testid: 'nav-estimates', h1: /Estimates/i },
      { testid: 'nav-invoices',  h1: /Invoices/i },
      { testid: 'nav-purchase-orders', h1: /Purchase Orders/i },
      { testid: 'nav-expenses',  h1: /Expenses/i },
      { testid: 'nav-vendors',   h1: /Vendors/i },
      { testid: 'nav-jobs',      h1: /Jobs/i },
      { testid: 'nav-scheduling',h1: /Scheduling/i },
      { testid: 'nav-fleet',     h1: /Fleet/i },
      { testid: 'nav-clients',   h1: /Client Portal/i },
      { testid: 'nav-teams',     h1: /Teams/i },
      { testid: 'nav-analytics', h1: /Analytics/i },
      { testid: 'nav-company',   h1: /Company/i },
    ];
    
    for (const c of clicks) {
      await page.getByTestId(c.testid).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.h1);
    }
  });

  test('Dashboard quick actions route correctly', async ({ page }) => {
    await page.goto('/app/dashboard');
    
    await page.getByTestId('qa-create-job').click();
    await expect(page).toHaveURL(/\/app\/jobs\/create/);
    
    await page.goto('/app/dashboard');
    await page.getByTestId('qa-new-po').click();
    await expect(page).toHaveURL(/\/app\/purchase-orders\/create/);
    
    await page.goto('/app/dashboard');
    await page.getByTestId('qa-manage-expenses').click();
    await expect(page).toHaveURL(/\/app\/finance\/expenses/);
  });

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-12345');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
  });

  test('External links open in new tab', async ({ page }) => {
    await page.goto('/');
    
    // Check that external links have correct attributes
    const apiLink = page.getByRole('link', { name: 'API' });
    await expect(apiLink).toHaveAttribute('target', '_blank');
    await expect(apiLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});