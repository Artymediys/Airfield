import { ORMConnection } from "../../config/orm.config.js";
import { Refueler } from "./entity/refueler.entity.js";

class RefuelerRepository {
  async getAll() {
    const refueler = await ORMConnection.getRepository(Refueler).find();

    return refueler;
  }

  async getById(id: string) {
    const refueler = await ORMConnection.getRepository(Refueler).findOneBy({
      id: id,
    });

    return refueler;
  }

  async create(dto: { id: string }) {
    const refueler = ORMConnection.getRepository(Refueler).create(dto);

    return await ORMConnection.getRepository(Refueler).save(refueler);
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(Refueler).delete(id);
  }
}

export default new RefuelerRepository();
