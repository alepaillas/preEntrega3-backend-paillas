import ticketRepository from "../persistences/mongo/repositories/ticket.repository.mjs";
import { generateUUID } from "../utils/uuid.mjs";

const getAll = async () => {
  return await ticketRepository.getAll();
};

const getById = async (id) => {
  return await ticketRepository.getById(id);
};

const createTicket = async (email, total, cartId) => {
  const newTicket = {
    amount: total,
    purchaser: email,
    code: generateUUID(),
    cart: cartId, // para referenciar el carrito comprado
  };

  return await ticketRepository.create(newTicket);
};

export default {
  getAll,
  getById,
  createTicket,
};
