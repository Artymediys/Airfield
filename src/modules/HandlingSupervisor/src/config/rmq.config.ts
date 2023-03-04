import client, { Channel, Message, Options } from "amqplib";
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

      this.channel = await connection.createChannel();

      await this.channel.assertExchange(MY_EXCHANGE_NAME, MY_EXCHANGE_TYPE, {
        durable: true,
        autoDelete: false,
        arguments: null,
      });

      await this.channel.assertQueue(MY_QUEUE_NAME, {
        durable: true,
        exclusive: false,
        autoDelete: false,
        arguments: null,
      });

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
}
