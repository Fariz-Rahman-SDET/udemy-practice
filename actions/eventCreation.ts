import test, { Page, expect } from "@playwright/test";
import { BaseURL } from "../config/env";
const eventTitleCreate = `Test Event ${Date.now()}`;
export class EventCreation {

    page: Page
    eventCards;
    titleCard;
    seatTextBefore!: number;
    constructor(page: Page) {
        this.page = page
        this.eventCards = this.page.getByTestId('event-card');
        this.titleCard = this.eventCards.filter({ hasText: eventTitleCreate });
    }


    async createEvent() {
        await expect(this.page.getByText('Browse Events →')).toBeVisible();
        await this.page.getByRole('button', { name: 'Admin' }).click();
        await this.page.locator("//div/a[text()='Manage Events']").click();
        await expect(this.page.getByRole("heading", { name: "+ New Event" })).toBeVisible();
        // const eventTitleCreate = `Test Event ${Date.now()}`;
        console.log(eventTitleCreate);
        await this.page.getByTestId("event-title-input").fill(`${eventTitleCreate}`);
        await this.page.getByPlaceholder("Describe the event…").fill("Book Event");
        await this.page.locator('#category').click();
        await this.page.locator('#category').selectOption({ label: 'Sports' });
        await this.page.locator('#city').fill('Coimbatore');
        await this.page.locator('#venue').fill('Race Course');
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 2);
        const eventDay = String(eventDate.getDate()).padStart(2, '0');
        const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
        const eventYear = eventDate.getFullYear();
        const dateTime = `${eventYear}-${eventMonth}-${eventDay}T16:30`;
        console.log(`Event DateTime: ${dateTime}`);
        await this.page.locator("//input[contains(@id,'event-date-')]").fill(dateTime);
        await this.page.locator("//input[contains(@id,'price')]").fill('200');
        await this.page.locator("#total-seats").fill('50');
        await this.page.getByRole("button", { name: '+ Add Event' }).click();
        await expect(this.page.locator("//p[text()='Event created!']")).toBeVisible({ timeout: 3000 });
    }
    // step 3 
    async verifyEvent() {
        await this.page.goto(`${BaseURL}/events`);
        // const eventCards = this.page.getByTestId('event-card');
        await expect(this.eventCards.first()).toBeVisible();
        const titleCard = this.eventCards.filter({ hasText: eventTitleCreate });
        await expect(titleCard).toBeVisible({ timeout: 5000 });
        const seatLocator = titleCard.locator(`//a/h3[text()='${eventTitleCreate}']/parent::a/following-sibling::div[contains(@class,'flex items-center')]/div/span`);
        this.seatTextBefore = parseInt(await seatLocator.innerText());
        console.log(this.seatTextBefore)
        await this.page.locator(`//a/h3[text()='${eventTitleCreate}']/parent::a/following-sibling::div[contains(@class,'flex items-center')]/a`).click();


    }
    /////// step4 
    async eventBooking() {
        await this.page.getByPlaceholder("Your full name").fill('Fariz');
        await this.page.getByPlaceholder("you@email.com").fill('Fariz@gmail.com');
        await this.page.getByPlaceholder("+91 98765 43210").fill('0987654321');
        let ticketCount = 1;
        if (test.info().title.includes('Group ticket booking')) {
            for (let i = 1; i < 3; i++) {
                await this.page.getByRole('button', { name: '+' }).click();
            }
            ticketCount = parseInt(await this.page.locator("#ticket-count").innerText());

        }

        await this.page.getByRole('button', { name: 'Confirm Booking' }).click();

        //step5
        const bookingRef = this.page.locator('.booking-ref').first();
        const bookingText = await bookingRef.innerText();
        await expect(bookingRef).toBeVisible();

        // Step 6
        await this.page.getByRole('button', { name: 'View My Bookings' }).click();
        await expect(this.page).toHaveURL(`${BaseURL}/bookings`);
        const bookingCard = this.page.locator("#booking-card").first();
        await expect(bookingCard).toBeVisible();
        await expect(bookingCard.locator('.booking-ref')).toHaveText(bookingText);
        await expect(bookingCard.locator('h3')).toHaveText(eventTitleCreate);
        const ticketCountAfterBooking = await bookingCard.locator("//div//span[contains(normalize-space(.),'ticket')]").innerText()
        expect(ticketCount).toBe(parseInt(ticketCountAfterBooking.split(' ')[1]))
        //checking eligible for refund
        if (test.info().title.includes('eligible for refund')) {
            await bookingCard.getByRole('button', { name: 'View Details' }).click();
            expect(bookingText.charAt(0)).toBe(eventTitleCreate.charAt(0));
            await this.page.getByTestId("check-refund-btn").click();
            const refundSpinner = this.page.locator("#refund-spinner");
            await expect(refundSpinner).toBeVisible({ timeout: 6000 });
            await expect(refundSpinner).not.toBeVisible({ timeout: 6000 });
            await expect(this.page.getByTestId("refund-result")).toBeVisible();
            if (test.info().title.includes('Group ticket booking')) {
                await expect(this.page.getByTestId("refund-result").locator('strong')).toContainText('Not eligible for refund.')
                await expect(this.page.getByTestId("refund-result").locator('span')).toContainText('Group bookings')
            }
            else {
                await expect(this.page.getByTestId("refund-result").locator('strong')).toContainText('Eligible for refund')
                await expect(this.page.getByTestId("refund-result").locator('span')).toContainText('Single-ticket bookings qualify for a full refund')
            }
        }
        await this.page.goto(`${BaseURL}/events`);
        await expect(this.eventCards.first()).toBeVisible();
        await expect(this.titleCard.first()).toBeVisible();
        const seatLocatorAfter = this.titleCard.locator(`//a/h3[text()='${eventTitleCreate}']/parent::a/following-sibling::div[contains(@class,'flex items-center')]/div/span`);
        const seatTextAfter = parseInt(await seatLocatorAfter.innerText())
        await expect(seatTextAfter).toBe(test.info().title.includes('Group ticket booking')?this.seatTextBefore - 3:this.seatTextBefore - 1);

    }


}