import { Message } from "amqplib";
import { MY_EXCHANGE_NAME, MY_QUEUE_NAME } from "./common/constants.js";
import { ORMConnection } from "./config/orm.config.js";
import { RMQConnection } from "./config/rmq.config.js";
import { Emitter } from "./emitter/emitter.js";
import { parser } from "./helper/parser.js";
import { BoardService } from "./modules/board/board.service.js";

export const rmq: RMQConnection = new RMQConnection({
  hostname: "178.20.43.80",
  port: 5672,
  username: "guest",
  password: "guest",
});

async function Start() {
  await rmq.init();

  await ORMConnection.initialize()
    .then(() => {
      console.log("Data Source has been initialized!\n");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization - ", err);
    });

  rmq.send("Visualizer", MY_EXCHANGE_NAME);

  const toStart = await rmq.channel.consume(
    MY_QUEUE_NAME,
    (msg: Message | null) => {
      parser(msg.content.toString());
      rmq.channel.ack(msg);
      return msg.content.toString();
    }
  );

  if (String(toStart) === "Start") {
  }

  const boardService = new BoardService();

  await boardService.sendMessage({
    machineId: "FM1",
    sender: "Follow Me",
    from: "FmGarage_1",
    isArrived: true,
  });
  await boardService.getMessage();
}

await Start();

// emitter.on("main_event", (obj: typeof objTest) => {
//   console.log("Emitter ON - ", obj);
// });

// emitter.log("User Logged");

// channel.publish("Visualizer", "", Buffer.from(MY_EXCHANGE_NAME));

//Binding my Queue to Exchange - "global"
// await channel.bindQueue(MY_QUEUE_NAME, "global", "");

// await channel.close();
// await connect.close();
