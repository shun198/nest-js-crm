import axios from 'axios';

export async function sendSlackNotification(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  try {
    await axios.post(webhookUrl, { text: message });
    console.log('Slack notification sent:', message);
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}
