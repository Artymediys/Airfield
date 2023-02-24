import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";
import { VipStates } from "../../../common/constants.js";
import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";

@Entity()
export class VipBus {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "vip_state",
    type: "enum",
    enum: VipStates,
    nullable: false,
    default: VipStates.FREE,
  })
  state: VipStates;

  @OneToOne(() => AirParking, (airParking) => airParking.vipBus)
  airParking: Relation<AirParking>;
}
