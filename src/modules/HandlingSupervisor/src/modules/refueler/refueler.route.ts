import Route from "express";
import RefuelerController from "./refueler.controller.js";

const refuelerRouter = Route();

refuelerRouter.get("/refueler", RefuelerController.getAll);
refuelerRouter.post("/refueler", RefuelerController.create);
refuelerRouter.delete("/refueler/:id", RefuelerController.delete);

export default refuelerRouter;
