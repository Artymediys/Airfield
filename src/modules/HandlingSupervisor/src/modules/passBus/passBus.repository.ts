import { ORMConnection } from "../../config/orm.config.js";
import { PassBus } from "./entity/passBus.entity.js";

class PassBusRepository {
  async getAll() {
    const followMe = await ORMConnection.getRepository(PassBus).find({
      relations: ["airParking"],
    });

    return followMe;
  }

  async getById(id: string) {
    const followMe = await ORMConnection.getRepository(PassBus).findOne({
      where: {
        id: id,
      },
      relations: ["airParking"],
    });

    return followMe;
  }

  async create(dto: { id: string }) {
    const followMe = ORMConnection.getRepository(PassBus).create(dto);

    return await ORMConnection.getRepository(PassBus).save(followMe);
  }

  async save(entity: PassBus) {
    try {
      return await ORMConnection.getRepository(PassBus).save(entity);
    } catch (error) {
      throw new Error("Something go wrong while saving Pass-Bus ");
    }
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(PassBus).delete(id);
  }
}

export default new PassBusRepository();
