const { test, expect } = require('@playwright/test');




test('Webst Client App login', async ({ page }) => {
const email = 'madan@pluginhive.com' ; 
const psw  = 'Madan@3425';


  await page.goto("https://admin.shopify.com/store/qa-moody-store");

  
  await page.locator('#account_email').fill(email);
  //await  page.pause();
  await page.locator('.ui-button__text').click();
  await page.locator('#account_password').fill(psw);
  await page.getByRole('button', { name: 'Log in' }).click();

//await page.locator("span a.Polaris-Navigation__Item").waitFor({ state: 'visible' })
  await page.locator("span a.Polaris-Navigation__Item").click();
  await  page.pause();
 // Wait for the iframe element
const frameElementHandle = await page.waitForSelector('iframe[title="QA-MultiCarrier Shipping Label"]');
// Get the Frame object from iframe element handle
const frame = await frameElementHandle.contentFrame();

await frame.locator('label[for="orders[0].select.value"]').click();


  await frame.getByRole('button', { name: 'Edit Packages' }).click();
  await frame.locator("form[id='manualPackages'] button:nth-child(2)").click();
  await frame.locator("input[placeholder='Type to filter options']").click();

//   const html = await frame.locator("input[placeholder='Type to filter options']").innerHTML();
// console.log(html);


const optionsContainer = await frame.locator("input[placeholder='Type to filter options']").locator('xpath=ancestor::div[1]/following-sibling::div');
await optionsContainer.locator('span').first().click();

});

test('placing order', async({page}) => {

const email = 'madan@pluginhive.com' ; 
const psw  = 'Madan@123';

 await page.context().clearCookies();
  await page.context().clearPermissions();




  await page.goto("https://admin.shopify.com/store/test-madan-store-2/apps/mcsl-qa");

  
  await page.locator('#account_email').fill(email);
  //await  page.pause();
  await page.locator('.ui-button__text').click();
  await page.locator('#account_password').fill(psw);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.pause();
  // Step 1: Hover over the "Online Store" text
await page.getByText('Online Store', { exact: true }).hover();
const icon = page.locator('.Polaris-Navigation__SecondaryAction').first();
await icon.click();

});


test.only('To order in a test store', async({page}) => {


await page.goto("https://test-madan-store-2.myshopify.com/password");
await page.locator("#password").fill('Madan')
await page.getByRole('button', { name: 'Enter' }).click();
await page.pause();
await page.getByRole('link', { name: 'View all' }).click();



});