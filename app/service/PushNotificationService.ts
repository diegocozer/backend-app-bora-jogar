import { Expo, ExpoPushMessage, ExpoPushReceipt } from 'expo-server-sdk';

class PushNotificationService {
  private expo: Expo;

  constructor() {
    // Initialize the Expo SDK client
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
      useFcmV1: false,
    });
  }

  public async sendPushNotification(expoPushToken: string, message: string, data: any) {
    const body: ExpoPushMessage = {
      to: expoPushToken,
      sound: 'default',
      title: 'Novo Aviso no Seu Time',
      body: message,
      data: data, // Passa dados personalizados aqui
    };

    try {
      if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
        return;
      }

      // Send the notification
      await this.expo.sendPushNotificationsAsync([body]);
    } catch (error) {
      console.error(`Erro ao enviar notificação para ${expoPushToken}:`, error);
    }
  }

  public async sendToMultipleUsers(expoPushTokens: string[], message: string, data: any) {
    const messages: ExpoPushMessage[] = expoPushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: 'Novo Aviso no Seu Time',
      body: message,
      data: data,
    }));

    try {
      // Chunk the messages to avoid hitting rate limits
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets: any[] = [];

      for (const chunk of chunks) {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      }

      // Process receipts to check if notifications were delivered
      const receiptIds = tickets
        .filter(ticket => ticket.status === 'ok')
        .map(ticket => ticket.id);

      const receiptChunks = this.expo.chunkPushNotificationReceiptIds(receiptIds);
      for (const receiptChunk of receiptChunks) {
        const receipts: { [key: string]: ExpoPushReceipt } = await this.expo.getPushNotificationReceiptsAsync(receiptChunk);

        for (const [receiptId, receipt] of Object.entries(receipts)) {
          if (receipt.status === 'error') {
            console.error(`Erro ao enviar notificação: ${receipt.message}`);
            if (receipt.details && receipt.details.error) {
              console.error(`Código de erro: ${receipt.details.error}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
    }
  }
}

export default new PushNotificationService();
