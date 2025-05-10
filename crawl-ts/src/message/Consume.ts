import amqp, { Channel, ChannelModel } from 'amqplib';
import config from '../config/config';


export async function handleLiveMessage(onMessage: (msg : amqp.ConsumeMessage| null)=> void): Promise<void> {

  const connection = await amqp.connect(config.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = config.RABBITMQ_QUEUE;
  await channel.assertQueue(queue, { durable: true });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C",);
  await channel.consume(queue, onMessage);

}