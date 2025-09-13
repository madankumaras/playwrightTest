const {test, expect} = require('@playwright/test');


test('Browser Context-Validating Error login', async ({page})=>
{

    await page.goto("https://rahulshettyacademy.com/client")
    await page.locator("#userEmail").fill("madangowda8095@gmail.com");
    await page.locator("#userPassword").fill("Madan@123");
    await page.locator("[value='Login']").click(); 
    //await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

 });


 test('Handling Alert PopUps and to handel Hide', async ({page})=>
 {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.pause();
    page.on('dialog' , dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover()

    const frmesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visiblr").click()
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);

 });