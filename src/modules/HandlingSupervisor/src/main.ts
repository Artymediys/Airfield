import { Message } from "amqplib";
import {
  MY_EXCHANGE_NAME,
  MY_QUEUE_NAME,
  PassengerReq,
} from "./common/constants.js";
import express, { Express } from "express";
import { ORMConnection } from "./config/orm.config.js";
import { RMQConnection } from "./config/rmq.config.js";
import boardService from "./modules/board/board.service.js";
import refuelerRouter from "./modules/refueler/refueler.route.js";
import followMeRouter from "./modules/followMe/followMe.route.js";
import airParkingRouter from "./modules/airParking/airParking.route.js";
import passBusRouter from "./modules/passBus/passBus.route.js";
import {
  IBoardMessage,
  IBoardFuel,
} from "./modules/board/interfaces/board.interface.js";
import vipBusRouter from "./modules/vipBus/vipBus.route.js";
import baggageTractorRoute from "./modules/baggageTractor/baggageTractor.route.js";
import boardRouter from "./modules/board/board.route.js";
import infoPanelService from "./modules/informationPanel/infoPanel.service.js";
import { IInfoPanel } from "./modules/informationPanel/interfaces/info-panel.interface.js";
import followMeService from "./modules/followMe/followMe.service.js";
import {
  IFollowMeInteraction,
  IFollowMeReq,
} from "./modules/followMe/interfaces/followMe.interface.js";
import refuelerService from "./modules/refueler/refueler.service.js";
import { IRefuelerReq } from "./modules/refueler/interfaces/refueler.interface.js";
import passBusService from "./modules/passBus/passBus.service.js";
import { IPassBusReq } from "./modules/passBus/interfaces/passBus.interface.js";

const app: Express = express();

app.use(express.json());
app.use("", refuelerRouter);
app.use("", followMeRouter);
app.use("", airParkingRouter);
app.use("", passBusRouter);
app.use("", vipBusRouter);
app.use("", baggageTractorRoute);
app.use("", boardRouter);

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

  // const toStart = await rmq.channel.consume(
  //   MY_QUEUE_NAME,
  //   (msg: Message | null): string | null => {
  //     return msg.content.toString();
  //   },
  //   {
  //     noAck: true,
  //   }
  // );

  rmq.on("message", (data, sender) => {
    try {
      // if (String(data) === "Start") {
      //   console.log(data);
      //   return;
      // }

      const content = JSON.parse(data);
      console.log(content.sender);

      switch (content.sender) {
        case "Board":
          console.log(`${sender} - `, content);
          if (typeof content.fuel === "undefined") {
            boardService.createBoard(content as unknown as IBoardMessage);
          } else {
            refuelerService.sendRefuelerToFuel(
              content as unknown as IBoardFuel
            );
          }
          break;
        case "Follow Me":
          console.log(`${sender} - `, content);
          followMeService.followMeReq(content as unknown as IFollowMeReq);
          break;
        case "Refueler":
          console.log(`${sender} - `, content);
          refuelerService.refuelerReq(content as unknown as IRefuelerReq);
          break;
        case "Passenger Bus":
          console.log(`${sender} - `, content);
          passBusService.passBusReq(content as unknown as IPassBusReq);
          break;
        case "Passenger":
          console.log(`${sender} - `, content);
          passBusService.passengerReq(content as unknown as PassengerReq);
          break;
        case "Vip Bus":
          console.log(`${sender} - `, content);
          break;
        case "Baggage Tractor":
          console.log(`${sender} - `, content);
          break;
        case "Information Panel":
          console.log(`${sender} - `, content);
          infoPanelService.sendToPassBus(content as unknown as IInfoPanel);
          break;
        default:
          console.log("DEFAULT - ", content);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}

await startApp();
await Start();
