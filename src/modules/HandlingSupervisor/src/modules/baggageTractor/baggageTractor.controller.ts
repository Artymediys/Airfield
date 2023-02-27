import { Request, Response } from "express";
import baggageTractorRepository from "./baggageTractor.repository.js";

class BaggageTractorController {
  async getAll(req: Request, res: Response) {
    try {
      const followMe = await baggageTractorRepository.getAll();
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const followMe = await baggageTractorRepository.create(req.body);
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await baggageTractorRepository.delete(req.params.id);
      return res.json(`Refueler ${req.params.id} deleted`);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new BaggageTractorController();
