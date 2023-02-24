import { Message } from "amqplib";
import { MY_EXCHANGE_NAME, MY_QUEUE_NAME } from "./common/constants.js";
import express, { Express } from "express";
import { ORMConnection } from "./config/orm.config.js";
import { RMQConnection } from "./config/rmq.config.js";
import { parser } from "./helper/parser.js";
import boardService from "./modules/board/board.service.js";
import refuelerRouter from "./modules/refueler/refueler.route.js";
import followMeRouter from "./modules/followMe/followMe.route.js";
import airParkingRouter from "./modules/airParking/airParking.route.js";
import { IBoardMessage } from "./modules/board/interfaces/board.interface.js";

const app: Express = express();

app.use(express.json());
app.use("", refuelerRouter);
app.use("", followMeRouter);
app.use("", airParkingRouter);

export const rmq: RMQConnection = new RMQConnection({
  hostname: "178.20.43.80",
  port: 5672,
  username: "guest",
  password: "guest",
});

const startApp = async () => {
  await ORMConnection.initialize()
    .then(() => {
      console.log("Data Source has been initialized!\n");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization - ", err);
    });

  app.listen(4444, async () => {
    console.log(`Server is running at http://localhost:4444`);
  });
};

async function Start() {
  try {
    await rmq.init();
  } catch (error) {
    console.log(error);
  }
  // let sender: string = "";

  rmq.send("Visualizer", MY_EXCHANGE_NAME);

  // const toStart = await rmq.channel.consume(
  //   MY_QUEUE_NAME,
  //   (msg: Message | null): string | null => {
  //     return msg.content.toString();
  //   },
  //   {
  //     noAck: true,
  //   }
  // );

  // if (String(toStart) === "Start") {
  //   return;
  // }
}

const getMes = async () => {
  while (true) {
    let message: string = await rmq.getMessage(MY_QUEUE_NAME);
    let sender: string = parser(message);

    // console.log("Sender --- ", sender);
    // console.log(message);

    switch (sender) {
      case "Board":
        boardService.createBoard(message as unknown as IBoardMessage);
        break;
      case "Follow Me":
        console.log("Follow Me");
        break;
      case "Refueler":
        break;
      case "Passenger Bus":
        console.log("Passenger Bus");
        break;
      case "Vip Bus":
        console.log("Vip Bus");
        break;
      case "Baggage tractor":
        console.log("Baggage tractor");
        break;
      default:
        console.log("DEFAULT");
    }
  }
};

await startApp();
await Start();
await getMes();
