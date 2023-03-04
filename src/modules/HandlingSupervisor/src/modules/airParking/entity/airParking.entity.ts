import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Board } from "../../../modules/board/entity/board.entity.js";
import { Refueler } from "../../../modules/refueler/entity/refueler.entity.js";
import { BaggageTractor } from "../../../modules/baggageTractor/entity/baggageTractor.enity.js";
import { PassBus } from "../../../modules/passBus/entity/passBus.entity.js";
import { VipBus } from "../../../modules/vipBus/entity/vipBus.entity.js";
import { FollowMe } from "../../../modules/followMe/entity/followMe.entity.js";

@Entity()
export class AirParking {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => Board, (board) => board.plain_id, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  board?: Board;

  @OneToOne(() => FollowMe, (followMe) => followMe.airParking, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  followMe?: FollowMe;

  @OneToOne(() => Refueler, (refueler) => refueler.airParking, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  refueler?: Refueler;

  @OneToOne(() => BaggageTractor, (baggageTractor) => baggageTractor.id, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  baggageTractor?: BaggageTractor;

  @OneToOne(() => PassBus, (passBus) => passBus.airParking, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  passBus?: PassBus;

  @OneToOne(() => VipBus, (vipBus) => vipBus.id, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  vipBus?: VipBus;
}
