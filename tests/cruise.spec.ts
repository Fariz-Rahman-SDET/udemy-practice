import { test, expect, chromium } from '@playwright/test';

test('Get the price list', async ({ page }) => {
    await page.goto("https://book.cruisedirect.com/swift/cruise?siid=344576&searchcruise=1&durations=&destinationtype=All");
      await page.waitForTimeout(10000);
    const newSearch = page.locator("//div/span/b[text()='New Search']");
    // await expect(newSearch).toBeVisible();
     await newSearch.click({timeout:4000});
    await page.getByPlaceholder("Select Cruise Line").click();
    await page.locator("//span/ul/li[text()='Disney Cruise Line']").click();
    await page.getByPlaceholder("Select Destination").click();
    await page.locator("//span/ul/li[text()='Alaska ']").click();
    const firstCard = page.locator("//div[contains(@class,'card cruise-item-card')]").first();
    await expect(firstCard).toBeVisible({ timeout: 3000 });
    const interiorPrice = await firstCard.locator("//thead/tr/th[normalize-space(text())='Interior']/ancestor::table/tbody/tr/td/span[@class='lowest-sailing-price d-block sailing-price-red']").nth(1).innerText();
    console.log(interiorPrice);

     const browser = await chromium.launch();
     const context = await browser.newContext()
    // const [newpage] = await Promise.all([
    //     context.waitForEvent('page'),
    //     page.goto("https://book.cruisedirect.com/swift/cruise?siid=344576&searchcruise=1&durations=&destinationtype=All")
    // ])
    const newpage = await context.newPage();

    await newpage.goto(
        "https://book.cruisedirect.com/swift/cruise?siid=344576&searchcruise=1&durations=&destinationtype=All"
    );

    await page.waitForTimeout(10000);
    const newPageSearch = page.locator("//div/span/b[text()='New Search']");
   // await expect(newPageSearch).toBeVisible();
    await newPageSearch.click({timeout:6000});
    await newpage.getByPlaceholder("Select Cruise Line").click();
    await newpage.locator("//span/ul/li[text()='Disney Cruise Line']").click();
    await newpage.getByPlaceholder("Select Destination").click();
    await newpage.locator("//span/ul/li[text()='Alaska ']").click();
    const newpagefirstCard = newpage.locator("//div[contains(@class,'card cruise-item-card')]").first();
    await expect(newpagefirstCard).toBeVisible({ timeout: 3000 });
    const newpageinteriorPrice = await newpagefirstCard.locator("//thead/tr/th[normalize-space(text())='Interior']/ancestor::table/tbody/tr/td/span[@class='lowest-sailing-price d-block sailing-price-red']").innerText();
    console.log(newpageinteriorPrice);

    await expect(interiorPrice).toBe(newpageinteriorPrice);



})