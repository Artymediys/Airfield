import { Request, Response } from "express";
import FollowMeRepository from "./followMe.repository.js";

class FolloMeController {
  async getAll(req: Request, res: Response) {
    try {
      const followMe = await FollowMeRepository.getAll();
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const followMe = await FollowMeRepository.create(req.body);
      return res.json(followMe);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await FollowMeRepository.delete(req.params.id);
      return res.json(`Refueler ${req.params.id} deleted`);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new FolloMeController();
