import { Request, Response } from "express";
import boardRepository from "./board.repository.js";

class BoardController {
  async getById(req: Request, res: Response) {
    try {
      const board = await boardRepository.getById(req.params.id);
      return res.json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new BoardController();
