import { Router } from "express";
import productsControllers from "../controllers/products.controllers.mjs";
import {
  authorization,
  passportCall,
} from "../middlewares/passport.middleware.mjs";

const router = Router();

router.get(
  "/",
  passportCall("jwt"),
  authorization("user"),
  productsControllers.getAll,
);

router.get("/:id", productsControllers.getById);

router.post("/", productsControllers.create);

router.put("/:id", productsControllers.update);

router.delete("/:id", productsControllers.deleteOne);

export default router;
