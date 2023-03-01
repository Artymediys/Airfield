import Route from "express";
import AirParkingController from "./airParking.controller.js";

const airParkingRouter = Route();

airParkingRouter.post("/airParking", AirParkingController.create);
airParkingRouter.get("/airParking", AirParkingController.getAll);

export default airParkingRouter;
