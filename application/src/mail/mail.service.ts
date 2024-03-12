import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MyMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInviteUserMail(email: string, invitationLink: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Invitation to User',
      template: 'test',
      context: {
        invitationLink,
      },
    });
  }
}
