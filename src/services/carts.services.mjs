import cartsRepository from "../persistences/mongo/repositories/carts.repository.mjs";

const getAll = async () => {
  return await cartsRepository.getAll();
};

const getById = async (id) => {
  return await cartsRepository.getById(id);
};

const create = async () => {
  return await cartsRepository.create();
};

const addProduct = async (cid, pid) => {
  return await cartsRepository.addProduct(cid, pid);
};

const updateProductQuantity = async (cid, pid, quantity) => {
  return await cartsRepository.updateProductQuantity(cid, pid, quantity);
};

const deleteProduct = async (cid, pid) => {
  return await cartsRepository.deleteProduct(cid, pid);
};

const clear = async (cid) => {
  return await cartsRepository.clear(cid);
};

const handleCartStock = async (cid, removeOutOfStock = false) => {
  const cart = await cartsRepository.getById(cid);
  const productsNotinStock = [];

  // Check product stock and identify out-of-stock products
  for (const i of cart.products) {
    const stock = i.product.stock;
    if (stock < i.quantity) {
      productsNotinStock.push(i.product);
    }
  }

  let updatedCart = null;
  if (removeOutOfStock && productsNotinStock.length > 0) {
    // Remove out-of-stock products from the cart
    const productIdsToRemove = productsNotinStock.map((product) =>
      product._id.toString(),
    );
    updatedCart = await cartsRepository.deleteProducts(cid, productIdsToRemove);
  }

  return {
    productsNotinStock,
    updatedCart: updatedCart || cart,
  };
};

const getCartTotal = async (cid) => {
  const cart = await cartsRepository.getById(cid);
  let total = 0;
  // por cada uno de los item en el carrito
  for (const i of cart.products) {
    total += i.product.price * i.quantity;
  }
  return total;
};

export default {
  getAll,
  getById,
  create,
  addProduct,
  updateProductQuantity,
  deleteProduct,
  clear,
  getCartTotal,
  handleCartStock,
};
