import {
  EXCHANGE_PASS_BUS,
  MY_EXCHANGE_NAME,
  PassBusStates,
} from "../../common/constants.js";
import { rmq } from "../../main.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import { AirParking } from "../airParking/entity/airParking.entity.js";
import { PassBus } from "../passBus/entity/passBus.entity.js";
import { IPassBusRes } from "../passBus/interfaces/passBus.interface.js";
import passBusRepository from "../passBus/passBus.repository.js";
import passBusService from "../passBus/passBus.service.js";
import { IInfoPanel } from "./interfaces/info-panel.interface.js";

const data: IPassBusRes = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "Passenger Bus",
};

class InfoPanelService {
  constructor() {}

  async sendToPassBus(message: IInfoPanel) {
    try {
      const { flight_id } = message;

      const freeAirParkings = (await airParkingRepository.getAll()).filter(
        (data: AirParking) => !data.passBus
      );

      if (freeAirParkings.length === 0) {
        throw new Error("NO FREE AIR-PARKING");
      }

      const freePassBuses = (await passBusRepository.getAll()).filter(
        (data: PassBus) => data.state != PassBusStates.FREE
      );

      freeAirParkings[0].passBus[0] = freePassBuses[0];
      freePassBuses[0].state = PassBusStates.TO_TAKE_PASS;

      await passBusRepository.save(freePassBuses[0]);
      await airParkingRepository.save(freeAirParkings[0]);

      data.machineId = freePassBuses[0].id;

      rmq.send(EXCHANGE_PASS_BUS, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new InfoPanelService();
