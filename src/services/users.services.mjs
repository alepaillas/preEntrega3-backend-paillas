import usersRepository from "../persistences/mongo/repositories/users.repository.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";

const getByEmail = async (email) => {
  const userData = await usersRepository.getByEmail(email);
  const user = userResponseDto(userData);
  return user;
};

export default {
  getByEmail,
};
