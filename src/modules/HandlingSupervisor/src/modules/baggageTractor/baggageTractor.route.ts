import Route from "express";
import baggageTractorController from "./baggageTractor.controller.js";

const baggageTractorRoute = Route();

baggageTractorRoute.post("/baggageTractor", baggageTractorController.create);

export default baggageTractorRoute;
