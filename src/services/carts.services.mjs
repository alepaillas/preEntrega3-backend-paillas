import cartsRepository from "../persistences/mongo/repositories/carts.repository.mjs";

const createCart = async () => {
  return await cartsRepository.create();
};

const addProductToCart = async (cid, pid) => {
  return await cartsRepository.addProductToCart(cid, pid);
};

const updateProductQuantity = async (cid, pid, quantity) => {
  return await cartsRepository.updateProductQuantity(cid, pid, quantity);
};

const deleteProductInCart = async (cid, pid) => {
  return await cartsRepository.deleteProductInCart(cid, pid);
};

const getCartById = async (id) => {
  return await cartsRepository.getById(id);
};

const clearCart = async (cid) => {
  return await cartsRepository.clearCart(cid);
};

export default {
  createCart,
  addProductToCart,
  updateProductQuantity,
  deleteProductInCart,
  getCartById,
  clearCart,
};
