import { ConsumeMessage } from 'amqplib';
export interface IConsumer {

  consume(msg: ConsumeMessage): Promise<void>;

}

class Consumer implements IConsumer{

  async consume(msg: ConsumeMessage) {
      console.log(msg);
  }

}


const test = new Consumer();
