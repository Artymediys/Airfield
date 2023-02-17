import { RMQConnection } from "./config/rmq.config.js";
import { Emitter } from "./emitter/emitter.js";
import { BoardService } from "./services/board.service.js";

export const rmq: RMQConnection = new RMQConnection({
  hostname: "178.20.43.80",
  port: 5672,
  username: "guest",
  password: "guest",
});

export const emitter = new Emitter();

export const objTest = {
  id: "u3u231joue21iu3h123iu",
};

async function Start() {
  await rmq.init();

  const boardService = new BoardService();

  await boardService.sendMessage(objTest);

  await boardService.getMessage();

  // emitter.on("main_event", (obj: typeof objTest) => {
  //   console.log("Emitter ON - ", obj);
  // });

  // emitter.log("User Logged");

  // channel.publish("Visualizer", "", Buffer.from(MY_EXCHANGE_NAME));

  //Binding my Queue to Exchange - "global"
  // await channel.bindQueue(MY_QUEUE_NAME, "global", "");

  // await channel.close();
  // await connect.close();
}

await Start();
