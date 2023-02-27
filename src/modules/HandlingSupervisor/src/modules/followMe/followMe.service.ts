import { rmq } from "../../main.js";
import { EXCHANGE_REFUELER, MY_EXCHANGE_NAME } from "../../common/constants.js";
import { ICallFollowMe } from "./interfaces/followMe.interface.js";
import { FollowMe } from "./entity/followMe.entity.js";
import followMeRepository from "./followMe.repository.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import { AirParking } from "../airParking/entity/airParking.entity.js";

const data: ICallFollowMe = {
  sender: MY_EXCHANGE_NAME,
  machineId: "",
  to: "MEETING_POINT",
};

class FolllowMeService {
  async send() {
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

      airParkingRepository.save(freeAirParkings[0]);

      data.machineId = freeFollowMes[0].id;

      rmq.send(EXCHANGE_REFUELER, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new FolllowMeService();
