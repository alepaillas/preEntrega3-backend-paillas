import { generateToken, verifyToken } from "../utils/jwt.mjs";
import envConfig from "../config/env.config.mjs";
import { isValidPassword } from "../utils/bcrypt.mjs";
import usersServices from "../services/users.services.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";

const COOKIE_TOKEN = envConfig.COOKIE_TOKEN;

const register = async (req, res) => {
  try {
    res
      .status(201)
      .json({ status: "success", msg: "User created succesfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error." });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user);
    // Guardamos el token en una cookie
    res.cookie(COOKIE_TOKEN, token, { httpOnly: true });
    const userDto = userResponseDto(user);
    req.session.user = user; // seteamos el user en la sesión para recuperarlo en el front
    return res.status(200).json({ status: "success", payload: userDto, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const jwt = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersServices.getByEmail(email);
    if (!user || !isValidPassword(user, password)) {
      return res
        .status(401)
        .json({ status: "error", msg: "usuario o contraseña no válido" });
    }

    const token = generateToken(user);
    res.cookie(COOKIE_TOKEN, token, { httpOnly: true });
    req.session.user = user; // seteamos el user en la sesión para recuperarlo en el front
    return res.status(200).json({ status: "success", payload: user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const current = (req, res) => {
  try {
    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const loginGithub = async (req, res) => {
  try {
    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();

    res
      .status(200)
      .json({ status: "success", msg: "Sesión cerrada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

export default {
  register,
  login,
  jwt,
  current,
  loginGithub,
  logout,
};
