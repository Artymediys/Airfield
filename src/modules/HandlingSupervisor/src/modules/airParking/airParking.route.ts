import Route from "express";
import AirParkingController from "./airParking.controller.js";

const airParkingRouter = Route();

airParkingRouter.post("/airParking", AirParkingController.create);

export default airParkingRouter;
