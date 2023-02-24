import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";
import { BaggageTractorStates } from "../../../common/constants.js";
import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";

@Entity()
export class BaggageTractor {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "baggage_tractor_state",
    type: "enum",
    enum: BaggageTractorStates,
    nullable: false,
    default: BaggageTractorStates.FREE,
  })
  state: BaggageTractorStates;

  @OneToOne(() => AirParking, (airParking) => airParking.baggageTractor)
  airParking: Relation<AirParking>;
}
