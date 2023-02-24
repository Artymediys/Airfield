import { Request, Response } from "express";
import { Refueler } from "./entity/refueler.entity.js";
import RefuelerRepository from "./refueler.repository.js";

class RefuelerController {
  async getAll(req: Request, res: Response) {
    try {
      const refueler = await RefuelerRepository.getAll();
      return res.json(refueler);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const refueler = await RefuelerRepository.create(req.body);
      return res.json(refueler);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await RefuelerRepository.delete(req.params.id);
      return res.json(`Refueler ${req.params.id} deleted`);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new RefuelerController();
