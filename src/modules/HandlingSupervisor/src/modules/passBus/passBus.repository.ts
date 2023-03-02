import { ORMConnection } from "../../config/orm.config.js";
import { PassBus } from "./entity/passBus.entity.js";

class PassBusRepository {
  async getAll() {
    const passBus = await ORMConnection.getRepository(PassBus).find({
      relations: ["airParking"],
    });

    return passBus;
  }

  async getById(id: string) {
    const passBus = await ORMConnection.getRepository(PassBus).findOne({
      where: {
        id: id,
      },
      relations: ["airParking"],
    });

    return passBus;
  }

  async getByFlightId(flight_id: string) {
    const passBus = await ORMConnection.getRepository(PassBus).findOne({
      where: { flight_id: flight_id },
      relations: ["airParking"],
    });

    if (!passBus) {
      throw new Error("Pass Bus with this flight_id NOT FOUND");
    }

    return passBus;
  }

  async create(dto: { id: string }) {
    const passBus = ORMConnection.getRepository(PassBus).create(dto);

    return await ORMConnection.getRepository(PassBus).save(passBus);
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
