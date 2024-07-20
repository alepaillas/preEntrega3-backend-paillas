import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/bcrypt.mjs";
import envConfig from "./env.config.mjs";
import userRepository from "../persistences/mongo/repositories/users.repository.mjs";

const JWT_PRIVATE_KEY = envConfig.JWT_PRIVATE_KEY;
const COOKIE_TOKEN = envConfig.COOKIE_TOKEN;
const GITHUB_CLIENT_ID = envConfig.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = envConfig.GITHUB_CLIENT_SECRET;

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[COOKIE_TOKEN];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          const user = await userRepository.getByEmail(email);
          if (user) {
            console.log("User already exists");
            return done(null, false, { message: "User already exists" });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await userRepository.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario: " + error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await userRepository.getByEmail(email);
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user); // User found and authenticated
        } catch (error) {
          console.error("Error during login:", error);
          return done(error); // Pass the error to Passport
        }
      },
    ),
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/githubCallback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //console.log(profile);

          // Obtener el correo electrónico del arreglo emails
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(
              new Error(
                "El correo electrónico no está disponible desde GitHub.",
              ),
            );
          }
          //console.log(email);
          const user = await userRepository.getByEmail(email);
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: email,
              age: "",
              password: "",
            };
            const result = await userRepository.create(newUser);
            return done(null, result);
          } else {
            return done(null, user); // User found and authenticated
          }
        } catch (error) {
          console.error("Error during login:", error);
          return done(error); // Pass the error to Passport
        }
      },
    ),
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userRepository.getById(id);
    done(null, user);
  });
};

export default initializePassport;
