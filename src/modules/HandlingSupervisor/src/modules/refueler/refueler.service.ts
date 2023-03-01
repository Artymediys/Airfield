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
  IRefuelerAction,
  IRefuelerSend,
} from "./interfaces/refueler.interface.js";
import refuelerRepository from "./refueler.repository.js";

const dataAction: IRefuelerAction = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  action: "",
};

const send: IRefuelerSend = {
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
      freeRefuelers[0].state = RefuelerStates.TO_TAKE_FUEL;

      await airParkingRepository.save(airParking);
      await refuelerRepository.save(freeRefuelers[0]);

      data.machineId = freeRefuelers[0].id;
      data.to = "Refueler";
      data.fuel = message.fuel;

      return rmq.send(EXCHANGE_REFUELER, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async refuelerReq(message: IRefuelerReq) {
    try {
      const refueler = await refuelerRepository.getById(message.machineId);

      if (refueler.state === RefuelerStates.TO_UNLOAD_FUEL) {
        refueler.state = RefuelerStates.FREE;

        refueler.airParking = null;

        await refuelerRepository.save(refueler);

        send.machineId = refueler.id;
        send.to = "Refueler";

        return rmq.send(EXCHANGE_REFUELER, send);
      } else if (refueler.state === RefuelerStates.TO_TAKE_FUEL) {
        refueler.state = RefuelerStates.TO_AIR_PARKING;

        await refuelerRepository.save(refueler);

        send.machineId = refueler.id;
        send.to = refueler.airParking.id;

        return rmq.send(EXCHANGE_REFUELER, data);
      } else if (refueler.state === RefuelerStates.TO_AIR_PARKING) {
        refueler.state = RefuelerStates.TO_UNLOAD_FUEL;

        await refuelerRepository.save(refueler);

        dataAction.machineId = refueler.id;
        dataAction.action = "Unload Fuel";

        return rmq.send(EXCHANGE_REFUELER, dataAction);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new RefuelerService();
