import { ORMConnection } from "../../config/orm.config.js";
import { FollowMe } from "./entity/followMe.entity.js";

class FollowMeRepository {
  async getAll() {
    const followMe = await ORMConnection.getRepository(FollowMe).find({
      relations: ["airParking"],
    });

    return followMe;
  }

  async getById(id: string) {
    const followMe = await ORMConnection.getRepository(FollowMe).findOne({
      where: {
        id: id,
      },
      relations: ["airParking"],
    });

    return followMe;
  }

  async create(dto: { id: string }) {
    const followMe = ORMConnection.getRepository(FollowMe).create(dto);

    return await ORMConnection.getRepository(FollowMe).save(followMe);
  }

  async save(entity: FollowMe) {
    try {
      return await ORMConnection.getRepository(FollowMe).save(entity);
    } catch (error) {
      throw new Error("Something go wrong while saving Follow-Me");
    }
  }

  async delete(id: string) {
    return await ORMConnection.getRepository(FollowMe).delete(id);
  }
}

export default new FollowMeRepository();
