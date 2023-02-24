import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";

@Entity()
export class Board {
  @PrimaryColumn()
  plain_id: string;

  @OneToOne(() => AirParking, (airParking) => airParking.board)
  airParking: Relation<AirParking>;
}
