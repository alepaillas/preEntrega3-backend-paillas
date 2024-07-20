import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.mjs";

const router = Router();

// devuelve todos los carritos
router.get("/", cartsControllers.getAllCarts);

// devuelve el carrito por id
router.get("/:cid", cartsControllers.getCartById);

// crea un nuevo carrito
router.post("/", cartsControllers.createCart);

// agrega un producto al carrito
router.post("/:cid/product/:pid", cartsControllers.addProductToCart);

// elimina todos los productos del carrito
router.delete("/:cid", cartsControllers.clearCart);

// elimina del carrito el producto seleccionado
router.delete("/:cid/product/:pid", cartsControllers.deleteProductInCart);

// actualiza la cantidad de ejemplare del producto en el carrito
router.put("/:cid/product/:pid", cartsControllers.updateProductQuantity);

export default router;
