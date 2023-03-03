import {
  EXCHANGE_PASSENGER,
  MY_EXCHANGE_NAME,
  PassBusStates,
} from "../../common/constants.js";
import { rmq } from "../../main.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import { AirParking } from "../airParking/entity/airParking.entity.js";
import { PassBus } from "../passBus/entity/passBus.entity.js";
import {
  IPassBusRes,
  IPassengerAction,
  PassengerAction,
} from "../passBus/interfaces/passBus.interface.js";
import passBusRepository from "../passBus/passBus.repository.js";
import { IInfoPanel } from "./interfaces/info-panel.interface.js";

const data: IPassBusRes = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "Passenger Bus",
};

const dataAction: IPassengerAction = {
  sender: MY_EXCHANGE_NAME,
  flight_id: "",
  action: PassengerAction.LOAD_PASS,
};

class InfoPanelService {
  constructor() {}

  async sendToPassBus(message: IInfoPanel) {
    try {
      const freeAirParkings = (await airParkingRepository.getAll()).filter(
        (data: AirParking) => !data.passBus
      );

      if (freeAirParkings.length === 0) {
        throw new Error("NO FREE AIR-PARKING");
      }

      const freePassBuses = (await passBusRepository.getAll()).filter(
        (data: PassBus) => data.state === PassBusStates.FREE
      );

      if (freePassBuses.length === 0) {
        throw new Error("NO FREE PASS BUSES");
      }

      freeAirParkings[0].passBus = freePassBuses[0];
      freePassBuses[0].airParking = freeAirParkings[0];
      freePassBuses[0].state = PassBusStates.TO_LOAD_PASS;
      freePassBuses[0].flight_id = message.flight_id;

      await passBusRepository.save(freePassBuses[0]);
      await airParkingRepository.save(freeAirParkings[0]);

      dataAction.flight_id = message.flight_id;

      rmq.send(EXCHANGE_PASSENGER, dataAction);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new InfoPanelService();
