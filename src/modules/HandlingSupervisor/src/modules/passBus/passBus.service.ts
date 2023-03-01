import { rmq } from "../../main.js";
import {
  EXCHANGE_PASS_BUS,
  MY_EXCHANGE_NAME,
  PassBusStates,
} from "../../common/constants.js";
import {
  IPassAction,
  IPassBusReq,
  IPassBusRes,
} from "./interfaces/passBus.interface.js";
import passBusRepository from "./passBus.repository.js";

const dataAction: IPassAction = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  action: "",
};

const res: IPassBusRes = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "",
};

class PassBusService {
  constructor() {}

  async passBusReq(message: IPassBusReq) {
    try {
      const passBus = await passBusRepository.getById(message.machineId);

      if (passBus.state === PassBusStates.TO_UNLOAD_PASS) {
        passBus.state = PassBusStates.FREE;

        passBus.airParking = null;

        await passBusRepository.save(passBus);

        res.machineId = passBus.id;
        res.to = "Passenger Bus";

        return rmq.send(EXCHANGE_PASS_BUS, res);
      } else if (passBus.state === PassBusStates.TO_TAKE_PASS) {
        passBus.state = PassBusStates.TO_AIR_PARKING;

        await passBusRepository.save(passBus);

        res.machineId = passBus.id;
        res.to = passBus.airParking.id;

        return rmq.send(EXCHANGE_PASS_BUS, res);
      } else if ((passBus.state = PassBusStates.TO_AIR_PARKING)) {
        passBus.state = PassBusStates.TO_UNLOAD_PASS;

        await passBusRepository.save(passBus);

        dataAction.machineId = passBus.id;
        dataAction.action = "Unload Pass";

        return rmq.send(EXCHANGE_PASS_BUS, dataAction);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new PassBusService();
