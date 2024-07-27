import cartsServices from "../services/carts.services.mjs";
import productsServices from "../services/products.services.mjs";
import ticketServices from "../services/ticket.services.mjs";

// devuelve todos los carritos
const getAll = async (req, res) => {
  try {
    const carts = await cartsServices.getAll();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// devuelve el carrito por id
const getById = async (req, res) => {
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
const create = async (req, res) => {
  try {
    const cart = await cartsServices.create();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal server error" });
  }
};

// agrega un producto al carrito
const addProduct = async (req, res) => {
  try {
    // Extraemos el Id de los request parameters
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await cartsServices.addProduct(cartId, productId);
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
const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.deleteProduct(cid, pid);
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
const clear = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });
    const clearedCart = await cartsServices.clear(cid);
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

// se podria optimizar mucho aqui haciendo 1 sola llamada a la base de datos
// sin embargo, es más "limpio" separar los servicios
const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const email = req.user.email;
    const { removeOutOfStock = false } = req.body || {};

    const cart = await cartsServices.getById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });

    // Check product stock and optionally remove out-of-stock items
    const { productsNotinStock, updatedCart } =
      await cartsServices.handleCartStock(cid, removeOutOfStock);

    // Check for an empty cart after potential removal
    if (updatedCart && updatedCart.products.length === 0) {
      return res.status(400).json({
        status: "Error",
        msg: "No hay productos con stock en el carrito.",
      });
    }

    const total = await cartsServices.getCartTotal(
      updatedCart ? updatedCart._id.toString() : cid,
    );

    /*
    La razón para usar la sintaxis updatedCart ? updatedCart._id.toString() : cid
    es para manejar el caso en el que updatedCart podría ser null o undefined.
    Esto asegura que se pase el ID correcto al método getCartTotal en ambos escenarios:

    Si updatedCart existe: Se pasa el ID de updatedCart.
    Si updatedCart no existe: Se pasa el ID original del carrito (cid).

    Esto es necesario porque updatedCart solo estará definido si removeOutOfStock es true
    y productos fuera de stock fueron removidos del carrito. Si updatedCart no está definido,
    significa que el carrito original no fue modificado y se debe usar su ID.
    */

    // Create the ticket
    const ticket = await ticketServices.createTicket(
      email,
      total,
      updatedCart ? updatedCart._id.toString() : cid,
    );

    // Update product stock
    const productsInCart = updatedCart ? updatedCart.products : cart.products;
    for (const item of productsInCart) {
      const product = item.product;
      const updatedStock = product.stock - item.quantity;
      await productsServices.update(product._id.toString(), {
        stock: updatedStock,
      });
    }

    res.status(200).json({
      status: "success",
      payload: ticket,
      updatedCart,
      productsNotinStock,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
};

export default {
  getAll,
  getById,
  create,
  addProduct,
  deleteProduct,
  updateProductQuantity,
  clear,
  purchaseCart,
};
