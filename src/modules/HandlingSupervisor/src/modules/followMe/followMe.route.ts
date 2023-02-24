import Route from "express";
import FollowMeController from "./followMe.controller.js";

const followMeRouter = Route();

followMeRouter.post("/followMe", FollowMeController.create);

export default followMeRouter;
