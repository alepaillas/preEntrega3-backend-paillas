import { request, response } from "express";
import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.mjs";

const JWT_PRIVATE_KEY = envConfig.JWT_PRIVATE_KEY;

export const generateToken = (user) => {
  const { _id, email, role } = user;
  const token = jwt.sign({ _id, email, role }, JWT_PRIVATE_KEY, {
    expiresIn: "1m",
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, JWT_PRIVATE_KEY);
    return decode;
  } catch (error) {
    return null;
  }
};

const authToken = (request, response, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return response.status(401).send({ error: "Not authenticated." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
    if (error) return response.status(403).send({ error: "Not Authorized." });
    req.user = credentials.user;
    next();
  });
};
