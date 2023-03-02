export interface IBoardMessage {
  sender: string;
  plain_id: string;
}

export interface IBoardFuel {
  sender: string;
  plain_id: string;
  fuel: number;
}

export interface IToBoardMsg {
  sender: string;
  plain_id: string;
  msg: string;
}

export interface IBoardCreate {
  plain_id: string;
}
