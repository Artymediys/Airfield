import { ORMConnection } from "../../config/orm.config.js";
import { PassBus } from "./entity/passBus.entity.js";

class PassBusRepository {
  async getAll() {
    const followMe = await ORMConnection.getRepository(PassBus).find();

    return followMe;
  }

  async getById(id: string) {
    const followMe = await ORMConnection.getRepository(PassBus).findOneBy({
      id: id,
    });

    return followMe;
  }

  async create(dto: { id: string }) {
    const followMe = ORMConnection.getRepository(PassBus).create(dto);

    return await ORMConnection.getRepository(PassBus).save(followMe);
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(PassBus).delete(id);
  }
}

export default new PassBusRepository();
