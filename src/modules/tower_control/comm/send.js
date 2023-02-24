const amqp = require("amqplib");

const Config = require("./config.json");

async function run()
{
	const connection = await amqp.connect(Config.connection);
	console.log("Connected to RabbitMQ server!")

	const channel = await connection.createChannel();
	console.log("Channel created!")


	process.on('SIGINT', () =>
	{
		channel.close();
		connection.close();
		console.info(' -> Client finished!');
	});


	await channel.assertExchange(Config.exchange.name, Config.exchange.type);
	console.log("Exchange asserted!")

	await channel.assertQueue(Config.queue.name);
	console.log("Queue asserted!")

	await channel.bindQueue(Config.queue.name, Config.exchange.name, "");
	await channel.bindQueue(Config.queue.name, "global", "");
	console.log("Queues bound!")

	channel.publish("Tower Control", "", Buffer.from("HI"));
	console.log("Message sent to... US!")
}

run();