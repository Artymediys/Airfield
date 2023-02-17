const amqp = require("amqplib");

const {Connection, Exchange, Queue} = require("config.json");

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

    const channel = await connection.createChannel();

    await channel.assertExchange(Exchange.name, Exchange.type);
    const twQueue = await channel.assertQueue(Queue);
    await channel.bindQueue(twQueue.queue, Exchange.name, "");

    channel.sendToQueue("Visualizer", Buffer.from(`${Exchange.name} connected`));

    const receivedMessage = await getMessage(channel, twQueue.queue);

    await channel.ack(receivedMessage);

    await channel.close();
    await connection.close();
}

run().then(() => console.log("Finished"));