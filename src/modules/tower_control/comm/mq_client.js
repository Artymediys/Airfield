const AMQP = require("amqplib");
const EventEmitter = require("events");

module.exports = class MQClient extends EventEmitter
{
	async connect(connInfo)
	{
		this.connection = await AMQP.connect(connInfo);
		this.channel = await this.connection.createChannel();
	}

	async setup(exchangeInfo, queueName)
	{
		await this.channel.assertExchange(exchangeInfo.name, exchangeInfo.type);

		await this.channel.assertQueue(queueName);

		await this.channel.bindQueue(queueName, exchangeInfo.name, "");
		await this.channel.bindQueue(queueName, "global", "");

		this.channel.consume(queueName, async msg =>
		{
			this.emit("message", msg.content.toString(), msg.fields.exchange);
			channel.ack(msg);
		});
	}

	close()
	{
		this.channel.close();
		this.connection.close();
	}
}