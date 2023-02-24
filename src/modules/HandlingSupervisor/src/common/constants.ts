export const PLAIN_WAIT_PLACE: string = "Plain_Wait_Place";
export const MY_EXCHANGE_NAME: string = "Handling Supervisor";
export const MY_EXCHANGE_TYPE: string = "fanout";
export const MY_QUEUE_NAME: string = "Handling Supervisor";
export const EXCHANGE_GLOBAL: string = "global";
export const EXCHANGE_APPROACH_CONTROL: string = "Approach Control";
export const EXCHANGE_BAGGAGE_TRACTOR: string = "Baggage tractor";
export const EXCHANGE_INFORMATION_PANEL: string = "Information Panel";
export const EXCHANGE_REFUELER: string = "Refueler";
export const EXCHANGE_PASS_BUS: string = "Passenger Bus";
export const EXCHANGE_VIP_BUS: string = "Vip Bus";
export const EXCHANGE_VISUALIZER: string = "Visualizer";
export const EXCHANGE_BOARD: string = "Board";
export const MEETING_POINT: string = "Meeting point";

export enum BaggageTractorStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_Take_Pass = "To_Take_Baggage",
}

export enum FollowMeStates {
  FREE = "Free",
  TO_MEETING_POINT = "To_Meeting_Point",
  TO_AIR_PARKING = "To_Air_Parking",
}

export enum PassBusStates {
  FREE = "Free",
  TO_MEETING_POINT = "To_Meeting_Point",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_Take_Pass = "To_Take_Pass",
}

export enum RefuelerStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
}

export enum VipStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_Take_Pass = "To_Take_Pass",
}
