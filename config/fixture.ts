import { test as baseTest, Page } from "@playwright/test";
import { LoginFunc } from "../actions/loginFunc";
import { Username, Password } from "./env";

type myFix = {
    authenticatedPage: Page,
    createEventAPI: string
};


export const customFixture = baseTest.extend<myFix>({

    authenticatedPage: async ({ page }, use) => {

        const login = new LoginFunc(page);

        await login.eventLogin(Username, Password);

        await use(page);


    },
    createEventAPI: async ({ authenticatedPage,request }, use) => {

        const token = await authenticatedPage.evaluate(() => {
            return localStorage.getItem("eventhub_token");
        });

        console.log("TOKEN:", token);

        const response = await request.post('https://api.eventhub.rahulshettyacademy.com/api/events',
            {
                data: {
                    "title": "fariz Summit 2026",
                    "description": "A premier technology conference.",
                    "category": "Conference",
                    "venue": "Coimbatore International Centre",
                    "city": "Coimbatore",
                    "eventDate": "2026-10-15T09:00:00.000Z",
                    "price": 500,
                    "totalSeats": 50,
                    "imageUrl": "https://example.com/banner.jpg"
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }

        )
        const result = await response.json()
        console.log(result)
        await use(result.data.title)
    }
})