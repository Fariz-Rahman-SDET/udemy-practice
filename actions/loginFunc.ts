import { Page } from "@playwright/test";
import { BaseURL } from "../config/env";

export class LoginFunc {
    page: Page
    constructor(page: Page) {
        this.page = page
    }
    async eventLogin(user: string, pass: string) {
        await this.page.goto(BaseURL);
        await this.page.getByPlaceholder('you@email.com').fill(user);//'paari1@gmail.com'
        await this.page.getByPlaceholder('••••••').fill(pass);//'Udemy@12345'
        await this.page.locator('#login-btn').click();
        await this.page.getByText('Browse Events →').click();
    }
}