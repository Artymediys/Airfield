import Route from "express";
import FollowMeController from "./followMe.controller.js";

const followMeRouter = Route();

followMeRouter.post("/followMe", FollowMeController.create);
followMeRouter.get("/followMe/:id", FollowMeController.getById);

export default followMeRouter;
