import EventEmitter from "events";
import { objTest } from "../main.js";

export class Emitter extends EventEmitter {
  log = (msg) => {
    console.log(msg);

    this.emit("main_event", objTest);
  };
}
