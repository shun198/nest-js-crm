import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): { msg: string } {
    return { msg: 'pass' };
  }
}
