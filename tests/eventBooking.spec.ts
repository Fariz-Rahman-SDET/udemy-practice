import { test } from '@playwright/test'
import { LoginFunc } from '../actions/loginFunc';
import { BaseURL, Username, Password } from '../config/env';
import { EventCreation } from '../actions/eventCreation';

test('Event Booking Creation', async ({ page }) => {
    const login = new LoginFunc(page);
    await login.eventLogin(Username, Password)

    const eventHubCreate = new EventCreation(page);
    await eventHubCreate.createEvent();
    await eventHubCreate.verifyEvent();
    await eventHubCreate.eventBooking();
});

test('Single ticket booking is eligible for refund', async ({ page }) => {
    const login = new LoginFunc(page);
    await login.eventLogin(Username, Password);
    const eventHubCreate = new EventCreation(page);
    await eventHubCreate.createEvent();
    await eventHubCreate.verifyEvent();
    await eventHubCreate.eventBooking();
});

test('Group ticket booking is NOT eligible for refund', async ({ page }) => {
    const login = new LoginFunc(page);
    await login.eventLogin(Username, Password);
    const eventHubCreate = new EventCreation(page);
    await eventHubCreate.createEvent();
    await eventHubCreate.verifyEvent();
    await eventHubCreate.eventBooking();
});
