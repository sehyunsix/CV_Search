import amqp from 'amqplib';
import config from '../config/config';
import readline from 'readline';


(async () => {
  const connection = await amqp.connect(config.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queue = config.RABBITMQ_QUEUE;
  await channel.assertQueue(queue, { durable: true });

  // readline 인터페이스 생성
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const message = line.trim();

    if (message.toLowerCase() === 'exit') {
      console.log('Exiting...');
      await channel.close();
      await connection.close();
      rl.close();
      process.exit(0);
    }

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent: ${message}`);
    rl.prompt();
  });

  rl.on('close', async () => {
    console.log('Input closed.');
    await channel.close();
    await connection.close();
    process.exit(0);
  });
  console.log('connection closed');
})();