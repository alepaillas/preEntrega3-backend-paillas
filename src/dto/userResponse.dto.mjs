export const userResponseDto = (user) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    age: user.age,
    email: user.email,
    role: user.role,
    password: user.password,
  };
};
