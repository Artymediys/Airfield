import { ORMConnection } from "../../config/orm.config.js";
import { VipBus } from "./entity/vipBus.entity.js";

class VipBusRepository {
  async getAll() {
    const followMe = await ORMConnection.getRepository(VipBus).find({
      relations: ["airParking"],
    });

    return followMe;
  }

  async getById(id: string) {
    const followMe = await ORMConnection.getRepository(VipBus).findOne({
      where: {
        id: id,
      },
      relations: ["airParking"],
    });

    return followMe;
  }

  async create(dto: { id: string }) {
    const followMe = ORMConnection.getRepository(VipBus).create(dto);

    return await ORMConnection.getRepository(VipBus).save(followMe);
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(VipBus).delete(id);
  }
}

export default new VipBusRepository();
