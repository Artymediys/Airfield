import { ORMConnection } from "../../config/orm.config.js";
import { BaggageTractor } from "./entity/baggageTractor.enity.js";

class BaggageTractorRepository {
  async getAll() {
    const followMe = await ORMConnection.getRepository(BaggageTractor).find();

    return followMe;
  }

  async getById(id: string) {
    const followMe = await ORMConnection.getRepository(
      BaggageTractor
    ).findOneBy({
      id: id,
    });

    return followMe;
  }

  async create(dto: { id: string }) {
    const followMe = ORMConnection.getRepository(BaggageTractor).create(dto);

    return await ORMConnection.getRepository(BaggageTractor).save(followMe);
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(BaggageTractor).delete(id);
  }
}

export default new BaggageTractorRepository();
