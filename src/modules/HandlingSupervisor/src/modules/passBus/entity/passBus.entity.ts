import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";
import { PassBusStates } from "../../../common/constants.js";

@Entity()
export class PassBus {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "pass_bus_state",
    type: "enum",
    enum: PassBusStates,
    nullable: false,
    default: PassBusStates.FREE,
  })
  state: PassBusStates;

  @Column({ default: null })
  flight_id: string;

  @ManyToOne(() => AirParking, (airParking) => airParking.passBus, {
    onDelete: "CASCADE",
  })
  airParking: Relation<AirParking>;
}
