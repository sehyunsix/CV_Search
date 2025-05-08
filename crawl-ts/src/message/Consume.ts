import amqp, { Channel, ChannelModel } from 'amqplib';
import config from '../config/config';



(async () => {
  const connection = await amqp.connect(config.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queue = config.RABBITMQ_QUEUE;
  await channel.assertQueue(queue, { durable: true });
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", );
  await channel.consume(queue, (msg) => (console.log(msg?.content.toString())));
  // 연결 닫기
  // await channel.close();
  // await connection.close();
  console.log('connection closed');
})();