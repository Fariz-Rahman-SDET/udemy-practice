import { expect, test } from '@playwright/test';
import { BaseURL, Username, Password } from '../config/env';
import { LoginFunc } from '../actions/loginFunc';


const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const YAHOO_USER = {
    email: "paari@yahoo.com",//"student@example.com",//"fariz@yahoo.com",
    password: "Udemy@123"//"secret123"//"fariz@123"
};

test('Login via API and fetch event ID', async ({ page, request }) => {

    // Step 1: Login as Yahoo user via API
    const loginRes = await request.post(`${API_URL}/auth/login`, {
        data: {
            email: YAHOO_USER.email,
            password: YAHOO_USER.password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });


    console.log("Login Status:", loginRes.status());
    expect(loginRes.ok()).toBeTruthy();

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Token:", token);

    // Step 2: Fetch events via API to get a valid event ID
    const eventRes = await request.get("https://api.eventhub.rahulshettyacademy.com/api/events", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log("Events Status:", eventRes.status());
    expect(eventRes.ok()).toBeTruthy();

    const eventData = await eventRes.json();
    console.log("Events List:", eventData);
    const eventId = await eventData.data[0].id;
    console.log(eventId);


    // Step 3 — Create a booking via API as Yahoo user

    const postBooking = await request.post("https://api.eventhub.rahulshettyacademy.com/api/bookings",
        {
            data: {
                "eventId": eventId,
                "customerName": "Fariz ",
                "customerEmail": "farizrahman@email.com",
                "customerPhone": "+91-9876543210",
                "quantity": 5
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    expect(postBooking.ok()).toBeTruthy();
    const bookingRes = await postBooking.json();
    console.log(bookingRes);
    const yahooBookingId = bookingRes.data.id;


    //Step 4 — Login as Gmail user via browser UI

    const UI_login = new LoginFunc(page);
    await UI_login.eventLogin(Username, Password)

    //Step 5 — Navigate to Yahoo's booking URL as Gmail user
    await page.goto(`${BaseURL}/bookings/${yahooBookingId}`, { waitUntil: 'networkidle' });

    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking')).toBeVisible();

});
