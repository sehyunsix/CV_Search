import  { ConsumeMessage } from 'amqplib';
import { Messenger } from './Messenger';
import { defaultLogger as logger } from '../utils/logger';


export class Consumer extends Messenger{

  constructor(queue: string) {
    super(queue);
  }


 async handleLiveMessage( onMessage: (msg : ConsumeMessage| null)=> Promise<void>): Promise<void> {

  if (!this.channel) {
    logger.error('[RabbitMQ] Channel is not initialized. Call connect() first.');
    throw new Error('[RabbitMQ] Channel is not initialized. Call connect() first.');
  }

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C",);
  await this.channel.consume(this.queue, (msg) => {
    if (msg !== null) {
      onMessage(msg).then(()=>
        this.channel!.ack(msg))
      .catch((err) => {
        console.error('Error processing message:', err);
        this.channel!.nack(msg, false, false);
      });
    }
  }, { noAck: false });

}

}