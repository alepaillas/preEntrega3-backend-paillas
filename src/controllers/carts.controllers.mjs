import cartsServices from "../services/carts.services.mjs";

// devuelve todos los carritos
const getAllCarts = async (req, res) => {
  try {
    const carts = await cartsServices.getAll();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// devuelve el carrito por id
const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// crea un nuevo carrito
const createCart = async (req, res) => {
  try {
    const cart = await cartsServices.create();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// agrega un producto al carrito
const addProductToCart = async (req, res) => {
  try {
    // Extraemos el Id de los request parameters
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartsServices.addProductToCart(cartId, productId);
    if (cart.product == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el producto con el id ${productId}`,
      });
    if (cart.cart == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cartId}`,
      });
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// elimina del carrito el producto seleccionado
const deleteProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.deleteProductInCart(cid, pid);
    if (cart.product == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el producto con el id: ${pid} en el carrito.`,
      });
    if (cart.cart == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id: ${cid}.`,
      });
    res.status(201).json({
      status: "success",
      msg: `Producto con id: ${pid} eliminado del carrito correctamente`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// actualiza la cantidad de ejemplares del producto en el carrito
const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body.quantity; // Access quantity from request body

    // Validation: Check if newQuantity is provided and positive
    if (!newQuantity || newQuantity <= 0) {
      return res.status(400).json({
        status: "Error",
        msg: "Se debe pasar una cantidad positiva para actualizar el carrito",
      });
    }

    const updatedCart = await cartsServices.updateProductQuantity(
      cid,
      pid,
      newQuantity,
    );

    if (updatedCart.product == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el producto con el id: ${pid} en el carrito.`,
      });
    if (updatedCart.cart == false)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id: ${cid}.`,
      });

    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({
      status: "Error",
      msg: "Error actualizando producto en el carrito",
    });
  }
};

// elimina todos los productos del carrito
const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });
    const clearedCart = await cartsServices.clearCart(cid);
    res.status(200).json({ status: "success", payload: clearedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// no funciona
// lo vimos en el after, pero el profesor tampoco lo pudo resolver
// lo dejo por si lo hago funcionar durante la semana
/* const replaceCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const body = req.body;
    const cart = await cartsServices.update(cid, body);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Erorr", msg: "Error interno del servidor" });
  }
};
 */

export default {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductInCart,
  updateProductQuantity,
  clearCart,
};
