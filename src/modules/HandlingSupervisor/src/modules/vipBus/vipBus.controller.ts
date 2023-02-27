import { Request, Response } from "express";
import vipBusRepository from "./vipBus.repository.js";

class VipBusController {
  async create(req: Request, res: Response) {
    try {
      const followMe = await vipBusRepository.create(req.body);
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new VipBusController();
