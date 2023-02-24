import { DataSource } from "typeorm";
import { AirParking } from "../modules/airParking/entity/airParking.entity.js";
import { BaggageTractor } from "../modules/baggageTractor/entity/baggageTractor.enity.js";
import { Board } from "../modules/board/entity/board.entity.js";
import { FollowMe } from "../modules/followMe/entity/followMe.entity.js";
import { PassBus } from "../modules/passBus/entity/passBus.entity.js";
import { Refueler } from "../modules/refueler/entity/refueler.entity.js";
import { VipBus } from "../modules/vipBus/entity/vipBus.entity.js";

export const ORMConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "edgar",
  password: "20012002",
  database: "handling_supervisor",
  synchronize: true,
  entities: [
    AirParking,
    BaggageTractor,
    Board,
    FollowMe,
    PassBus,
    Refueler,
    VipBus,
  ],
});
