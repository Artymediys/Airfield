import client, { Channel, Connection, Message, Options } from "amqplib";
import EventEmitter from "events";

import {
  MY_EXCHANGE_NAME,
  MY_EXCHANGE_TYPE,
  MY_QUEUE_NAME,
} from "../common/constants.js";

export class RMQConnection extends EventEmitter {
  public log: string;
  private isConnected: boolean = false;
  private settings: Options.Connect;
  public channel: Channel;
  static instance: RMQConnection;

  constructor(settings: Options.Connect) {
    super();
    this.settings = settings;
  }

  public async init(): Promise<Channel> {
    try {
      if (this.isConnected) {
        return;
      }

      this.isConnected = true;
      const connection: client.Connection = await client.connect(this.settings);

      // this.log = "Successfull connection to RMQ server";

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
      await this.channel.bindQueue(MY_QUEUE_NAME, "global", "");

      this.channel.consume(MY_QUEUE_NAME, async (messsage: Message | null) => {
        this.emit(
          "message",
          messsage.content.toString(),
          messsage.fields.exchange
        );
        this.channel.ack(messsage);
      });

      // return this.channel;
    } catch (err) {
      console.log(err);
    }
  }

  public send(exchangeName: string, message: any) {
    try {
      return this.channel.publish(
        exchangeName,
        "",
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  // public getMessage(myQueue: string): Promise<string | null | undefined> {
  //   try {
  //     return new Promise<string | null | undefined>((resolve: any) => {
  //       this.channel.consume(myQueue, (msg: Message | null): string | null =>
  //         resolve(msg.content.toString(), this.channel.ack(msg))
  //       );
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}