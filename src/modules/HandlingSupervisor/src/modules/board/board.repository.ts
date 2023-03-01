import { ORMConnection } from "../../config/orm.config.js";
import { Board } from "./entity/board.entity.js";
import { IBoardCreate } from "./interfaces/board.interface.js";

class BoardRepository {
  async getById(id: string) {
    try {
      const board = await ORMConnection.getRepository(Board).findOne({
        where: {
          plain_id: id,
        },
        relations: ["airParking"],
      });

      if (!board) {
        throw Error("Board not found");
      }

      return board;
    } catch (error) {
      throw Error(error);
    }
  }

  async create(dto: { plain_id: string }) {
    const board = ORMConnection.getRepository(Board).create(dto);

    return await ORMConnection.getRepository(Board).save(board);
  }
}

export default new BoardRepository();
