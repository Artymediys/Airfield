import { Message } from "amqplib";
import { IBoard } from "src/interfaces/board/board.interface.js";
import { MY_QUEUE_NAME } from "../common/constants.js";
import { rmq } from "../main.js";

export class BoardService {
  async getMessage() {
    try {
      return await rmq.receive(MY_QUEUE_NAME, (msg: Message) => {
        console.log(msg.content.toString());
        rmq.channel.ack(msg);
      });
    } catch (err) {
      console.log(err);
    }
  }

  async sendMessage(board: IBoard) {
    try {
      return await rmq.send(MY_QUEUE_NAME, board);
    } catch (err) {
      console.log(err);
    }
  }
}
