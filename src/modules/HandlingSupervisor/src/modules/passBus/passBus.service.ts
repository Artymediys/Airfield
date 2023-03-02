import { rmq } from "../../main.js";
import {
  EXCHANGE_PASSENGER,
  EXCHANGE_PASS_BUS,
  MY_EXCHANGE_NAME,
  PassBusStates,
  PassengerReq,
} from "../../common/constants.js";
import {
  IPassengerAction,
  IPassBusReq,
  IPassBusRes,
  PassengerAction,
} from "./interfaces/passBus.interface.js";
import passBusRepository from "./passBus.repository.js";

const dataAction: IPassengerAction = {
  sender: MY_EXCHANGE_NAME,
  flight_id: "",
  action: PassengerAction.UNLOAD_PASS,
};

const res: IPassBusRes = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "",
};

class PassBusService {
  constructor() {}

  async passengerReq(message: PassengerReq) {
    const passBus = await passBusRepository.getByFlightId(message.flight_id);
    res.machineId = passBus.id;

    if (message.msg === "Passengers Loaded") {
      passBus.state = PassBusStates.TO_AIR_PARKING;

      res.to = passBus.airParking.id;

      await passBusRepository.save(passBus);
      return rmq.send(EXCHANGE_PASS_BUS, res);
    }

    passBus.state = PassBusStates.TO_GARAGE;

    res.to = "Passenger Bus";

    await passBusRepository.save(passBus);
    return rmq.send(EXCHANGE_PASS_BUS, res);
  }

  async passBusReq(message: IPassBusReq) {
    try {
      const passBus = await passBusRepository.getById(message.machineId);

      if (passBus.state === PassBusStates.TO_GARAGE) {
        passBus.state = PassBusStates.FREE;

        passBus.airParking = null;

        await passBusRepository.save(passBus);

        return;
      } else if (passBus.state === PassBusStates.TO_AIR_PARKING) {
        passBus.state = PassBusStates.TO_UNLOAD_PASS;

        dataAction.flight_id = passBus.flight_id;

        await passBusRepository.save(passBus);

        return rmq.send(EXCHANGE_PASSENGER, dataAction);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new PassBusService();
