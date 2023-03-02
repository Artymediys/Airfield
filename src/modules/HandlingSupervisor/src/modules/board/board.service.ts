import { Message } from "amqplib";
import { IBoardCreate, IBoardMessage } from "./interfaces/board.interface.js";
import {
  EXCHANGE_REFUELER,
  MY_EXCHANGE_NAME,
  MY_QUEUE_NAME,
} from "../../common/constants.js";
import { rmq } from "../../main.js";
import boardRepository from "./board.repository.js";
import airParkingRepository from "../airParking/airParking.repository.js";
import { AirParking } from "../airParking/entity/airParking.entity.js";
import followMeService from "../followMe/followMe.service.js";

class BoardService {
  constructor() {}

  public async createBoard(message: IBoardMessage) {
    try {
      const { plain_id } = message;

      //Logic for saving board to AirParking
      const board = await boardRepository.create({ plain_id });
      const freeAirParkings = (await airParkingRepository.getAll()).filter(
        (data: AirParking) => !data.board
      );

      if (freeAirParkings.length === 0) {
        throw new Error("NO FREE AIR-PARKING");
      }

      freeAirParkings[0].board = board;

      //Save Board to AirParking
      await airParkingRepository.save(freeAirParkings[0]);

      await followMeService.sendFMToMP(freeAirParkings[0].id);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new BoardService();
