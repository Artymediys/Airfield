import { ORMConnection } from "../../config/orm.config.js";
import { AirParking } from "./entity/airParking.entity.js";

class AirParkingRepository {
  async getAll() {
    const airParking = ORMConnection.getRepository(AirParking).find();

    return airParking;
  }

  async getById(id: string) {
    const airParking = await ORMConnection.getRepository(AirParking).findOne({
      where: {
        id: id,
      },
    });

    if (!airParking) {
      new Error("AirParking not found");
    }

    return airParking;
  }

  async create(dto: { id: string }) {
    try {
      const airParking = ORMConnection.getRepository(AirParking).create(dto);

      return await ORMConnection.getRepository(AirParking).save(airParking);
    } catch (error) {
      throw new Error(error);
    }
  }

  async save(entity: AirParking) {
    try {
      return await ORMConnection.getRepository(AirParking).save(entity);
    } catch (error) {
      throw new Error("Something go wrong while saving AIR-PARKING ");
    }
  }
}

export default new AirParkingRepository();
