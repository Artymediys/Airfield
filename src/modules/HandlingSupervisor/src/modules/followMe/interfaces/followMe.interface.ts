export interface IFollowMeInteraction {
  sender: string;
  machineId: string;
  to: string;
}

export interface IFollowMeReq {
  sender: string;
  machineId: string;
  arrived: true;
}
