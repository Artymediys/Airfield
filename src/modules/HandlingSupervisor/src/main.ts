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
import passBusRouter from "./modules/passBus/passBus.route.js";
import { IBoardMessage } from "./modules/board/interfaces/board.interface.js";
import vipBusRouter from "./modules/vipBus/vipBus.route.js";
import baggageTractorRoute from "./modules/baggageTractor/baggageTractor.route.js";

const app: Express = express();

app.use(express.json());
app.use("", refuelerRouter);
app.use("", followMeRouter);
app.use("", airParkingRouter);
app.use("", passBusRouter);
app.use("", vipBusRouter);
app.use("", baggageTractorRoute);

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

  rmq.channel.publish("Visualizer", "", Buffer.from(String(MY_EXCHANGE_NAME)));
  rmq.send("Tower Control", { id: "123" });

  rmq.on("message", (content) => {
    let sender: string = parser(content);

    console.log(sender);

    switch (sender) {
      case "Board":
        console.log("Board - ", content);
        // boardService.createBoard(message as unknown as IBoardMessage);
        break;
      case "Follow Me":
        console.log("Follow Me -", content);
        break;
      case "Refueler":
        console.log("Refueler - ", content);
        break;
      case "Passenger Bus":
        console.log("Passenger Bus - ", content);
        break;
      case "Vip Bus":
        console.log("VIP-BUS - ", content);
        break;
      case "Baggage Tractor":
        console.log("Baggage tractor - ", content);
        break;
      default:
        console.log("DEFAULT - ", content);
    }
  });

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
  //   console.log(toStart);
  // }
}

await startApp();
await Start();
