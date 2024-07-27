import { Router } from "express";
import productsControllers from "../controllers/products.controllers.mjs";
import {
  authorization,
  passportCall,
} from "../middlewares/passport.middleware.mjs";

const router = Router();

router.get("/", productsControllers.getAll);

router.get("/:id", productsControllers.getById);

router.post(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  productsControllers.create,
);

router.put(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  productsControllers.update,
);

router.delete(
  "/:id",
  passportCall("jwt"),
  authorization("admin"),
  productsControllers.deleteOne,
);

export default router;
