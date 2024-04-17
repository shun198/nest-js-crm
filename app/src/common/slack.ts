import axios from 'axios';
import { Logger } from '@nestjs/common';

export async function sendSlackNotification(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const logger = new Logger('HTTP');

  try {
    await axios.post(webhookUrl, { text: message });
    logger.log('メッセージの送信に成功しました:', message);
  } catch (error) {
    logger.error('メッセージの送信に失敗しました:', error);
  }
}
