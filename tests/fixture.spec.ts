import { test,expect } from "@playwright/test";
import { customFixture } from "../config/fixture";

customFixture('fixture testing', async ({ authenticatedPage, createEventAPI }) => {

    await authenticatedPage.goto("https://eventhub.rahulshettyacademy.com/events");
    const resFixture = createEventAPI;
    console.log(resFixture);

    await expect(authenticatedPage.getByText(resFixture).nth(0)).toBeVisible({timeout:2000})
})