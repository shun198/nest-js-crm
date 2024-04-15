import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InviteUserDto } from 'src/user/dto/inviteUser.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data: InviteUserDto) {
    const subject = `ようこそ`;

    await this.mailerService.sendMail({
      to: data.email,
      subject,
      template: './welcome',
    });
  }

  async resetPasswordEmail(data) {
    const { name, email, link } = data;

    const subject = `Company: Reset Password`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './reset-password',
      context: {
        link,
        name,
      },
    });
  }

  async verifyUserEmail(data) {
    const { name, email, otp } = data;

    const subject = `Company: OTP To Verify Email`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './verify-user',
      context: {
        otp,
        name,
      },
    });
  }
}
