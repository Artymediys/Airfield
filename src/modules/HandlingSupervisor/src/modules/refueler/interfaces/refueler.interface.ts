export interface IRefuelerInteraction {
  sender: string;
  machineId: string;
  to: string;
  fuel: number;
}

export interface IRefuelerSend {
  sender: string;
  machineId: string;
  to: string;
}

export interface IRefuelerAction {
  sender: string;
  machineId: string;
  action: string;
}

export interface IRefuelerReq {
  sender: string;
  machineId: string;
  arrived: true;
}
