const {test, expect} = require('@playwright/test');


test('First Playwright test', async ({browser})=>
{
//chrome - plugins/ cookies
const context = await browser.newContext();
const page = await context.newPage();
//page.route('**/*.{jpg,png,jpeg}',route=> route.abort());   //for block the request
const userName = page.locator("#username");
const signIn = page.locator("#signInBtn");
const cardTitles = page.locator(".card-body a");
page.on('request',request=> console.log(request.url()));
page.on('response',response=> console.log(response.url(), response.status()))

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
console.log(await page.title());
//css
await userName.fill("rahulshetty");
await page.locator("[type='password']").fill("learning");
await signIn.click();
//wait
console.log(await page.locator("[style*='block']").textContent());
await expect(page.locator("[style*='block']")).toContainText('Incorrect');
// type
await userName.fill("");
await userName.fill("rahulshettyacademy"); 
await signIn.click();
console.log(await cardTitles.first().textContent());
console.log(await cardTitles.nth(1).textContent());
const allTitels = await cardTitles.allTextContents();
console.log(allTitels);

}); 

test('UI Controls', async ({browser,page})=>    
{

await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
const userName = page.locator("#username");
const signIn = page.locator("#signInBtn");
const documentLink = page.locator("[href*='documents-request']");
const dropdown = page.locator("select.form-control");
await dropdown.selectOption("consult"); 
await page.locator(".radiotextsty").last().click();
await page.locator("#okayBtn").click();
//await page.pause();
//assertion
await expect(page.locator(".radiotextsty").last()).toBeChecked();
console.log(await page.locator(".radiotextsty").last().isChecked()); 
await page.locator("#terms").uncheck();
expect(await page.locator("#terms").isChecked()).toBeFalsy();
await expect(documentLink).toHaveAttribute("class", "blinkingText")
await page.pause();
});  

test('Child window Handel', async ({browser})=>    
{
 const context = await browser.newContext();
const page = await context.newPage();
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
const documentLink = page.locator("[href*='documents-request']");

const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
])

const text = await newPage.locator(".red").textContent();
const arrayText = text.split("@")
const domain = arrayText[1].split(" ")[0]
console.log(domain);
await page.locator("#username").fill(domain);
await page.pause();
console.log(await page.locator("#username").valueInput());



});

