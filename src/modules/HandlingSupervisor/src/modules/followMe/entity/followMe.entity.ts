import { AirParking } from "../../../modules/airParking/entity/airParking.entity.js";
import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";
import { FollowMeStates } from "../../../common/constants.js";

@Entity()
export class FollowMe {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "follow_me_state",
    type: "enum",
    enum: FollowMeStates,
    nullable: false,
    default: FollowMeStates.FREE,
  })
  state: FollowMeStates;

  @OneToOne(() => AirParking, (airParking) => airParking.followMe)
  airParking: Relation<AirParking>;
}
