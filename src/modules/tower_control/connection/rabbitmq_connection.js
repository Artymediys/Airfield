const amqp = require("amqplib");

const {connection: Connection, exchange: Exchange, queue: Queue} = require("./config.json");


function getMessage(channel, queue) {
    return new Promise(resolve => {
        channel.consume(queue, msg => resolve(msg));
    });
}

async function run() {
    const connection = await amqp.connect({
        hostname: Connection.host,
        port: Connection.port,
        username: Connection.username,
        password: Connection.password,
    });
    console.log("Connected to RabbitMQ server!")

    const channel = await connection.createChannel();
    console.log("Channel created!")


    process.on('SIGINT', () => {
        channel.close();
        connection.close();
        console.info(' -> Client finished!');
    });


    await channel.assertExchange(Exchange.name, Exchange.type);
    console.log("Exchange asserted!")

    const twQueue = await channel.assertQueue(Queue);
    console.log("Exchange asserted!")

    await channel.bindQueue(twQueue.queue, Exchange.name, "");
    await channel.bindQueue(twQueue.queue, "global", "");
    console.log("Queues bound!")

    /*
    channel.sendToQueue("Visualizer", Buffer.from(`${Exchange.name}`));
    console.log("Message sent to Visualizer queue!")
     */

    channel.publish("Visualizer", "", Buffer.from(`${Exchange.name}`));
    console.log("Message sent to Visualizer exchanger!")

    const receivedMessage = await getMessage(channel, twQueue.queue);
    console.log(`Message received: ${receivedMessage.content.toString()}`);

    await channel.ack(receivedMessage);
    console.log("Acknowledged!");
}

run().then(() => console.log("\nClient started!"));