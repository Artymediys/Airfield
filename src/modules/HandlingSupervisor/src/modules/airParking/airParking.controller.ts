import { Request, Response } from "express";
import AirParkingRepository from "./airParking.repository.js";

class AirParkingController {
  async getAll(req: Request, res: Response) {
    try {
      const airParkings = await AirParkingRepository.getAll();

      return res.json(airParkings);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const airParking = await AirParkingRepository.create(req.body);
      return res.json(airParking);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new AirParkingController();
