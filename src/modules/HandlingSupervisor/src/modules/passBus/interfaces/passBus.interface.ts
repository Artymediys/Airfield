export interface IPassBusRes {
  sender: string;
  machineId: string;
  to: string;
}

export interface IPassengerAction {
  sender: string;
  flight_id: string;
  action: string;
}

export interface IPassBusReq {
  sender: string;
  machineId: string;
  arrived: true;
}

export enum PassengerAction {
  LOAD_PASS = "Load Pass",
  UNLOAD_PASS = "Unload Pass",
}
