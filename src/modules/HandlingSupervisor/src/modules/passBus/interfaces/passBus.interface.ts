import { PassBus } from "src/common/constants.js";

export interface IPassBusRes {
  sender: string;
  machineId: string;
  to: string;
}

export interface IPassAction {
  sender: string;
  machineId: string;
  action: string;
}

export interface IPassBusReq {
  sender: string;
  machineId: string;
  arrived: true;
}
