import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  resendApiKey: process.env.RESEND_API_KEY,
  from: process.env.MAIL_FROM ?? 'Talon <onboarding@resend.dev>',
  resetPasswordUrl:
    process.env.PASSWORD_RESET_URL ?? 'http://localhost:3000/reset-password',
}));
