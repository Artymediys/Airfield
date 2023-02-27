import Route from "express";
import vipBusController from "./vipBus.controller.js";

const vipBusRouter = Route();

vipBusRouter.post("/vipBus", vipBusController.create);

export default vipBusRouter;
