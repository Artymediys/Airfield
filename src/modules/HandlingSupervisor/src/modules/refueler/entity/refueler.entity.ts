import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";
import { RefuelerStates } from "../../../common/constants.js";
import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";

@Entity()
export class Refueler {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "refueler_state",
    type: "enum",
    enum: RefuelerStates,
    nullable: false,
    default: RefuelerStates.FREE,
  })
  state: RefuelerStates;

  @OneToOne(() => AirParking, (airParking) => airParking.refueler)
  airParking: Relation<AirParking>;
}
