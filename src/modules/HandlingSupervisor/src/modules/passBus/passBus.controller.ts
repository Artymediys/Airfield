import { Request, Response } from "express";
import { MY_EXCHANGE_NAME } from "../../common/constants.js";
import { rmq } from "../../main.js";
import passBusRepository from "./passBus.repository.js";

const passObj = {
  sender: MY_EXCHANGE_NAME,
  machineId: "PB1",
  to: "AP1",
};

class PassBusController {
  async send(req: Request, res: Response) {
    try {
      rmq.send("Passenger Bus", passObj);

      return res.json(passObj);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const followMe = await passBusRepository.create(req.body);
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new PassBusController();
