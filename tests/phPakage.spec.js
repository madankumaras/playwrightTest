const { test, expect } = require('@playwright/test');

test('Webst Client App login', async ({ page }) => {
  const email = 'madan@pluginhive.com';
  const psw = 'Madan@123';

  await page.goto('https://admin.shopify.com/store/test-madan-store-2/apps/mcsl-qa?link_source=search');

  await page.locator('#account_email').fill(email);
   await page.pause();
  await page.locator('.ui-button__text').click();
  await page.locator('#account_password').fill(psw);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Wait for the app iframe
  const frameElementHandle = await page.waitForSelector('iframe[title="QA-MultiCarrier Shipping Label"]', { state: 'visible' });
  const frame = await frameElementHandle.contentFrame();

  // (Optional) if the "LABELS" tab is outside the iframe, keep this on `page`.
  // If it's inside the iframe in your app, switch this to `frame.locator(...)`.
  await frame.locator('span:has-text("LABELS")').click();

  // ---- Helpers (index-free, header-driven) ----
  /**
   * Find the `.col-*` class for a given header text (e.g., "Label Status" -> "col-status").
   * Works on the header row: `.table-sub-row-cp.subHeader.batch-table`
   */
  async function getColumnClass(ctx, headerText) {
    const header = ctx.locator('.table-sub-row-cp.subHeader.batch-table > div', { hasText: headerText }).first();
    await header.waitFor({ state: 'visible' });
    const classes = (await header.getAttribute('class')) || '';
    const colClass = classes.split(/\s+/).find(c => c.startsWith('col-'));
    if (!colClass) throw new Error(`No "col-*" class found for header "${headerText}".`);
    return colClass;
  }

  /**
   * Find a body row by a header/value pair (e.g., "Order" -> "#1166").
   * Body rows are `.table-sub-row-cp.batch-table` without `.subHeader`.
   */
  async function getRowByHeaderValue(ctx, headerText, value) {
    const colClass = await getColumnClass(ctx, headerText);
    const rows = ctx.locator('.table-sub-row-cp.batch-table:not(.subHeader)');
    const row = rows.filter({ has: ctx.locator(`.${colClass}`, { hasText: value }) }).first();
    await row.waitFor({ state: 'visible' });
    return row;
  }

  /**
   * Return the cell locator addressed by (targetHeader) within the row identified by (rowHeader,rowValue).
   */
  async function getCell(ctx, targetHeader, rowHeader, rowValue) {
    const [targetCol, row] = await Promise.all([
      getColumnClass(ctx, targetHeader),
      getRowByHeaderValue(ctx, rowHeader, rowValue),
    ]);
    return row.locator(`.${targetCol}`);
  }

  /**
   * Get trimmed innerText of the addressed cell.
   */
  async function getCellText(ctx, targetHeader, rowHeader, rowValue) {
    const cell = await getCell(ctx, targetHeader, rowHeader, rowValue);
    await cell.waitFor({ state: 'visible' });
    return (await cell.innerText()).trim();
  }

  /**
   * ASSERTION helper: exact text match.
   */
  async function expectCellText(ctx, targetHeader, rowHeader, rowValue, expected) {
    const actual = await getCellText(ctx, targetHeader, rowHeader, rowValue);
    await expect(actual, `Cell "${targetHeader}" in row where "${rowHeader}"="${rowValue}"`).toBe(expected);
  }

  // ---- Your validation: Label Status = SUCCESS for Order #1166 (index-free) ----
  await expectCellText(frame, 'Fulfillment Status', 'Order', '#1166', 'SUCCESS');

  // (Examples you can use later)
  // await expectCellText(frame, 'Fulfillment Status', 'Order', '#1166', 'PENDING');
  // const carrier = await getCellText(frame, 'Carrier', 'Order', '#1166');
  // expect(carrier).toContain('USPS Parcel Select');
});
