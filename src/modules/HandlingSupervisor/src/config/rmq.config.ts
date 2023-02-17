import client, { Channel, Connection, Message, Options } from "amqplib";

import {
  MY_EXCHANGE_NAME,
  MY_EXCHANGE_TYPE,
  MY_QUEUE_NAME,
} from "../common/constants.js";

export class RMQConnection {
  private isConnected: boolean = false;
  private settings: Options.Connect;
  public channel: Channel;
  static instance: RMQConnection;

  constructor(settings: Options.Connect) {
    this.settings = settings;
  }

  public async init(): Promise<Channel> {
    if (this.isConnected) {
      return;
    }

    try {
      this.isConnected = true;
      const connection: client.Connection = await client.connect(this.settings);

      // Create channel
      this.channel = await connection.createChannel();

      // Create Exchange
      await this.channel.assertExchange(MY_EXCHANGE_NAME, MY_EXCHANGE_TYPE, {
        durable: true,
        autoDelete: false,
        arguments: null,
      });

      // Create Queue
      await this.channel.assertQueue(MY_QUEUE_NAME, {
        durable: true,
        exclusive: false,
        autoDelete: false,
        arguments: null,
      });

      // Binding my Queue to my Exchange
      await this.channel.bindQueue(MY_QUEUE_NAME, MY_EXCHANGE_NAME, "");

      return this.channel;
    } catch (err) {
      console.log(err);
    }
  }

  public async send(exchangeName: string, message: Object) {
    this.channel.publish(
      exchangeName,
      "",
      Buffer.from(JSON.stringify(message))
    );
  }

  public async receive(
    myQueue: string,
    onMessage: (msg: Message | null) => any,
    options?: Options.Consume
  ) {
    return await this.channel.consume(myQueue, onMessage, options);
  }
}

//////////////////////////////////

// export const connectionToRmq = async (): Promise<Channel> => {
//   //Connect to RMQ
//   const connection: client.Connection = await client.connect({
//     hostname: "178.20.43.80",
//     port: 5672,
//     username: "guest",
//     password: "guest",
//   });

//   const channel: Channel = await connection.createChannel();

//   //Create Exchange
//   await channel.assertExchange(MY_EXCHANGE_NAME, MY_EXCHANGE_TYPE, {
//     durable: true,
//     autoDelete: false,
//     arguments: null,
//   });

//   //Create Queue
//   await channel.assertQueue(MY_QUEUE_NAME, {
//     durable: true,
//     exclusive: false,
//     autoDelete: false,
//     arguments: null,
//   });

//   //Binding my Queue to my Exchange
//   await channel.bindQueue(MY_QUEUE_NAME, MY_EXCHANGE_NAME, "");

//   return channel;
// };
