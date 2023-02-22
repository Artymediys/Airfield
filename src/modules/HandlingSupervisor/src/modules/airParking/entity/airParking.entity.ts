import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IAirParking } from "../interfaces/airParking.interface.js";

@Entity()
export class AirParking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  board?: string;

  @Column({ nullable: true })
  refueler?: string;

  @Column({ nullable: true })
  baggageTractor?: string;

  @Column("simple-array", { nullable: true })
  passBus: string;

  @Column({ nullable: true })
  vipBus: string;
}
