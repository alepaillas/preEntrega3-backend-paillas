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

export default {
  getAll,
  getById,
  create,
  addProduct,
  updateProductQuantity,
  deleteProduct,
  clear,
};
