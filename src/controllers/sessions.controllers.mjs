import { generateToken } from "../utils/jwt.mjs";
import envConfig from "../config/env.config.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";
import { jwtResponseDto } from "../dto/jwtResponse.dto.mjs";

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

const current = (req, res) => {
  try {
    const user = req.user;
    const jwtDTO = jwtResponseDto(user);
    return res.status(200).json({ status: "success", payload: jwtDTO });
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
  current,
  loginGithub,
  logout,
};
