import { rmq } from "../../main.js";
import {
  EXCHANGE_BOARD,
  EXCHANGE_FOLLOM_ME,
  EXCHANGE_REFUELER,
  FollowMeStates,
  MEETING_POINT,
  MY_EXCHANGE_NAME,
} from "../../common/constants.js";
import {
  IFollowMeInteraction,
  IFollowMeReq,
} from "./interfaces/followMe.interface.js";
import { FollowMe } from "./entity/followMe.entity.js";
import followMeRepository from "./followMe.repository.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import { AirParking } from "../airParking/entity/airParking.entity.js";

const toBoard = {
  message: "Send Fuel",
};

const data: IFollowMeInteraction = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "",
};

class FolllowMeService {
  async sendFMToMP() {
    try {
      const freeAirParkings = (await airParkingRepository.getAll()).filter(
        (data: AirParking) => !data.followMe
      );

      if (freeAirParkings.length === 0) {
        throw new Error("NO FREE AIR-PARKING");
      }

      const freeFollowMes = (await followMeRepository.getAll()).filter(
        (data: FollowMe) => !data.airParking
      );

      if (freeFollowMes.length === 0) {
        throw new Error("NO FREE FOLLOW-ME");
      }

      freeAirParkings[0].followMe = freeFollowMes[0];
      freeFollowMes[0].state = FollowMeStates.TO_MEETING_POINT;

      await followMeRepository.save(freeFollowMes[0]);
      await airParkingRepository.save(freeAirParkings[0]);

      data.machineId = freeFollowMes[0].id;
      data.to = MEETING_POINT;

      rmq.send(EXCHANGE_FOLLOM_ME, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async followMeReq(message: IFollowMeReq) {
    try {
      const followMe = await followMeRepository.getById(message.machineId);

      if (followMe.state === FollowMeStates.TO_AIR_PARKING) {
        followMe.state = FollowMeStates.FREE;

        followMe.airParking = null;

        await followMeRepository.save(followMe);

        data.machineId = followMe.id;
        data.to = "Follow Me";

        rmq.send(EXCHANGE_BOARD, toBoard);

        return rmq.send(EXCHANGE_FOLLOM_ME, data);
      }

      followMe.state = FollowMeStates.TO_AIR_PARKING;

      await followMeRepository.save(followMe);

      data.machineId = followMe.id;
      data.to = followMe.airParking.id;

      return rmq.send(EXCHANGE_FOLLOM_ME, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new FolllowMeService();
