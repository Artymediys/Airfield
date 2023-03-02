import {
  EXCHANGE_REFUELER,
  MY_EXCHANGE_NAME,
  RefuelerStates,
} from "../../common/constants.js";
import { rmq } from "../../main.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import boardRepository from "../board/board.repository.js";
import { IBoardFuel } from "../board/interfaces/board.interface.js";
import { Refueler } from "./entity/refueler.entity.js";
import {
  IRefuelerInteraction,
  IRefuelerReq,
  IRefuelerSend,
} from "./interfaces/refueler.interface.js";
import refuelerRepository from "./refueler.repository.js";

const sendTo: IRefuelerSend = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "",
};

const data: IRefuelerInteraction = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "",
  fuel: 0,
};

class RefuelerService {
  constructor() {}

  async sendRefuelerToFuel(message: IBoardFuel) {
    try {
      const board = await boardRepository.getById(message.plain_id);

      const freeRefuelers = (await refuelerRepository.getAll()).filter(
        (data: Refueler) => !data.airParking
      );

      if (freeRefuelers.length === 0) {
        throw new Error("NO FREE REFUELERS");
      }

      const airParking = await airParkingRepository.getById(
        board.airParking.id
      );

      airParking.refueler = freeRefuelers[0];
      freeRefuelers[0].airParking = airParking;
      freeRefuelers[0].state = RefuelerStates.TO_AIR_PARKING;

      await airParkingRepository.save(airParking);
      await refuelerRepository.save(freeRefuelers[0]);

      data.machineId = freeRefuelers[0].id;
      data.to = airParking.id;
      data.fuel = message.fuel;

      return rmq.send(EXCHANGE_REFUELER, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async refuelerReq(message: IRefuelerReq) {
    try {
      const refueler = await refuelerRepository.getById(message.machineId);

      if (refueler.state === RefuelerStates.TO_GARAGE) {
        refueler.state = RefuelerStates.FREE;

        refueler.airParking = null;
        await refuelerRepository.save(refueler);

        return;
      } else if (refueler.state === RefuelerStates.TO_AIR_PARKING) {
        refueler.state = RefuelerStates.TO_GARAGE;

        await refuelerRepository.save(refueler);

        sendTo.machineId = refueler.id;
        sendTo.to = "Refueler";

        return rmq.send(EXCHANGE_REFUELER, sendTo);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new RefuelerService();
