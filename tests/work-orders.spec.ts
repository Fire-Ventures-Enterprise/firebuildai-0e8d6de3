import { test, expect } from '@playwright/test';

test.describe('Work Orders E2E Flow', () => {
  test('Invoice → Generate WO → Crew portal submit → Invoice adjustments', async ({ page }) => {
    // Navigate to invoices
    await page.goto('/app/invoices');
    
    // Select first invoice with schedule
    await page.locator('[data-testid="invoice-row"]').first().click();
    
    // Generate work order
    await page.locator('[data-testid="btn-generate-work-order"]').click();
    await expect(page.locator('[data-testid="btn-open-work-order"]')).toBeVisible();
    
    // Open work order
    await page.locator('[data-testid="btn-open-work-order"]').click();
    await expect(page.locator('[data-testid="wo-detail"]')).toBeVisible();
    
    // Generate crew link
    await page.locator('[data-testid="btn-wo-actions"]').click();
    await page.getByText('Crew Link / QR').click();
    await expect(page.locator('[data-testid="crew-link-dialog"]')).toBeVisible();
    
    // Copy crew link
    const crewLink = await page.locator('[data-testid="crew-link-input"]').inputValue();
    await page.locator('[data-testid="btn-copy-link"]').click();
    
    // Navigate to crew portal
    await page.goto(crewLink);
    await expect(page.locator('text=Field Report')).toBeVisible();
    
    // Submit field report
    await page.fill('textarea[id="notes"]', 'Work completed successfully');
    await page.fill('input[id="labor"]', '4');
    await page.fill('input[id="signature-name"]', 'John Doe');
    await page.getByRole('button', { name: /Submit Field Report/i }).click();
    
    // Go back to invoice
    await page.goto('/app/invoices');
    await page.locator('[data-testid="invoice-row"]').first().click();
    
    // Check for adjustments banner
    await expect(page.locator('[data-testid="invoice-adjustments-banner"]')).toBeVisible();
    
    // Approve adjustments
    await page.locator('[data-testid="btn-approve-adjustments"]').click();
    await expect(page.locator('text=Adjustments approved')).toBeVisible();
  });

  test('Work Orders list search and filters', async ({ page }) => {
    await page.goto('/app/work-orders');
    
    // Test search
    await page.fill('input[placeholder*="Search"]', 'kitchen');
    await page.waitForTimeout(500); // Debounce
    
    // Test status filter
    await page.selectOption('select', 'issued');
    
    // Open work order from list
    await page.locator('[data-testid="wo-row"]').first().click();
    await expect(page.locator('[data-testid="wo-detail"]')).toBeVisible();
  });

  test('Generate work order from invoice modal', async ({ page }) => {
    await page.goto('/app/work-orders');
    
    // Open modal
    await page.locator('[data-testid="btn-wo-generate-from-invoice"]').click();
    
    // Search for invoice
    await page.fill('input[placeholder*="Search"]', 'INV-');
    await page.waitForTimeout(500);
    
    // Select invoice
    await page.locator('[data-testid="invoice-select-row"]').first().click();
    
    // Generate work order
    await page.getByRole('button', { name: /Generate Work Order/i }).click();
    await expect(page.locator('[data-testid="wo-detail"]')).toBeVisible();
  });
});