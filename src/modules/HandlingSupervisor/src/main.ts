import { MY_EXCHANGE_NAME, PassengerReq } from "./common/constants.js";
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
import { IFollowMeReq } from "./modules/followMe/interfaces/followMe.interface.js";
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
  hostname: "",
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

  rmq.on("message", (data, sender) => {
    try {
      if (data === "Start") {
        console.log(data);
        return;
      }

      switch (JSON.parse(data).sender) {
        case "Board":
          console.log(`${sender} - `, JSON.parse(data));
          if (typeof JSON.parse(data).fuel === "undefined") {
            boardService.createBoard(
              JSON.parse(data) as unknown as IBoardMessage
            );
          } else {
            refuelerService.sendRefuelerToFuel(
              JSON.parse(data) as unknown as IBoardFuel
            );
          }
          break;
        case "Follow Me":
          console.log(`${sender} - `, JSON.parse(data));
          followMeService.followMeReq(
            JSON.parse(data) as unknown as IFollowMeReq
          );
          break;
        case "Refueler":
          console.log(`${sender} - `, JSON.parse(data));
          refuelerService.refuelerReq(
            JSON.parse(data) as unknown as IRefuelerReq
          );
          break;
        case "Passenger Bus":
          console.log(`${sender} - `, JSON.parse(data));
          passBusService.passBusReq(JSON.parse(data) as unknown as IPassBusReq);
          break;
        case "Passenger":
          console.log(`${sender} - `, JSON.parse(data));
          passBusService.passengerReq(
            JSON.parse(data) as unknown as PassengerReq
          );
          break;
        case "Vip Bus":
          console.log(`${sender} - `, JSON.parse(data));
          break;
        case "Baggage Tractor":
          console.log(`${sender} - `, JSON.parse(data));
          break;
        case "Information Panel":
          console.log(`${sender} - `, JSON.parse(data));
          infoPanelService.sendToPassBus(
            JSON.parse(data) as unknown as IInfoPanel
          );
          break;
        default:
          console.log("DEFAULT - ", JSON.parse(data));
      }
    } catch (error) {
      throw new Error(error);
    }
  });
}

await startApp();
await Start();
