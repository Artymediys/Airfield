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
export const EXCHANGE_FOLLOM_ME: string = "Follow Me";
export const EXCHANGE_BOARD: string = "Board";
export const MEETING_POINT: string = "Meeting point";

export enum BaggageTractorStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_TAKE_BAGGAGE = "To_Take_Baggage",
  TO_UNLOAD_BAGGAGE = "To_Unload_Baggage",
}

export enum FollowMeStates {
  FREE = "Free",
  TO_MEETING_POINT = "To_Meeting_Point",
  TO_AIR_PARKING = "To_Air_Parking",
}

export enum PassBusStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_TAKE_PASS = "To_Take_Pass",
  TO_UNLOAD_PASS = "To_Unload_Pass",
}

export enum RefuelerStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_TAKE_FUEL = "To_Take_Fuel",
  TO_UNLOAD_FUEL = "To_Unload_Fuel",
}

export enum VipStates {
  FREE = "Free",
  TO_AIR_PARKING = "To_Air_Parking",
  TO_TAKE_PASS = "To_Take_Pass",
  TO_UNLOAD_PASS = "To_Unload_Pass",
}

export enum BaggageTractor {
  BG1 = "BG1",
  BG2 = "BG2",
  BG3 = "BG3",
  BG4 = "BG4",
}

export enum FollowMe {
  FM1 = "FM1",
  FM2 = "FM2",
  FM3 = "FM3",
  FM4 = "FM4",
}

export enum PassBus {
  PB1 = "PB1",
  PB2 = "PB2",
  PB3 = "PB3",
  PB4 = "PB4",
}

export enum Refueler {
  RF1 = "RF1",
  RF2 = "RF2",
  RF3 = "RF3",
  RF4 = "RF4",
}

export enum AirParkingProps {
  BOARD = "board",
  FOLLOW_ME = "followMe",
  REFUELER = "refueler",
  BAGGAGE_TRACTOR = "baggageTractor",
  PASS_BUS = "passBus",
  VIP_BUS = "vipBus",
}
