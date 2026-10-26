import dotenv from 'dotenv';

dotenv.config({ override: true });

export const BaseURL = process.env.BASE_URL!;
export const Username = process.env.USERNAME!;
export const Password = process.env.PASSWORD!;