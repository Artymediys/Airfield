import Route from "express";
import PassBusController from "./passBus.controller.js";

const passBusRouter = Route();

passBusRouter.post("/passBus", PassBusController.create);

export default passBusRouter;
