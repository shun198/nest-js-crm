import { Controller } from '@nestjs/common';
import { MyMailerService } from './mail.service';
import { Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class MailController {
  constructor(private readonly mailerService: MyMailerService) {}

  @ApiTags('users')
  @Post('send_invite_user_email')
  async sendInviteUserMail(@Body('email') email: string) {
    // Generate a unique invitation link
    const invitationLink = 'your_generated_link_here';

    // Send the invitation mail
    await this.mailerService.sendInviteUserMail(email, invitationLink);
  }
}
