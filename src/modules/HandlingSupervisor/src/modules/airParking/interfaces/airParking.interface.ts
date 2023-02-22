import { IBaggageTractor } from "../../baggageTractor/baggageTractor.interface.js";
import { IBoard } from "../../board/interfaces/board.interface.js";
import { IPassBus } from "../../passBus/passBus.interface.js";
import { IRefueler } from "../../refueler/interfaces/refueler.interface.js";
import { IVipBus } from "../../vipBus/vipBus.interface.js";

export interface IAirParking {
  readonly id: string;
  readonly board?: IBoard;
  readonly refueler?: IRefueler;
  readonly baggageTractor?: IBaggageTractor;
  readonly passBus?: IPassBus[];
  readonly vipBus?: IVipBus;
}
