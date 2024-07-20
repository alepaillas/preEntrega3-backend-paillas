import { Router } from "express";
import productsRouter from "./products.routes.mjs";
import cartsRouter from "./carts.routes.mjs";
import sessionRouter from "./sessions.routes.mjs";

const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);
router.use("/session", sessionRouter);

export default router;
