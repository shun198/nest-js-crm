import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  // https://notiz.dev/blog/send-emails-with-nestjs
  async welcomeEmail(email: string, url: string, name: string, expiry: Date) {
    const subject = `管理システムへようこそ`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './welcome',
      context: {
        url,
        name,
        expiry,
      },
    });
  }

  async resetPasswordEmail(
    email: string,
    url: string,
    name: string,
    expiry: Date,
  ) {
    const subject = `パスワードを再設定してください`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './reset-password',
      context: {
        url,
        name,
        expiry,
      },
    });
  }
}
