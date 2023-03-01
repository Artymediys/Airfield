import Route from "express";
import boardController from "./board.controller.js";

const boardRouter = Route();

boardRouter.get("/board/:id", boardController.getById);

export default boardRouter;
