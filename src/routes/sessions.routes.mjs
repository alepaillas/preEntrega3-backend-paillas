import { Router } from "express";
import passport from "passport";
import {
  passportCall,
  authorization,
} from "../middlewares/passport.middleware.mjs";
import sessionsControllers from "../controllers/sessions.controllers.mjs";
import { sendMail } from "../utils/sendMails.mjs";

const router = Router();

router.post(
  "/register",
  passportCall("register"),
  sessionsControllers.register,
);

router.post("/login", passportCall("login"), sessionsControllers.login);

router.get(
  "/github",
  passport.authenticate("github"),
  sessionsControllers.loginGithub,
);

router.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user) {
      req.session.user = req.user;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  },
);

router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  sessionsControllers.current,
);

router.get("/logout", sessionsControllers.logout);

router.get("/email", async (req, res) => {
  const { name } = req.body;

  const template = `
    <div>
      <h1> Bienvenid@ ${name} a nuestra App </h1>
      <img src="cid:gatito" />
    </div>
  `;

  try {
    await sendMail(
      "alepaillas@gmail.com",
      "Test nodemailer",
      "Este es un mensaje de prueba",
      template,
    );
    return res.status(200).json({ status: "ok", msg: "Email enviado." });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res
      .status(500)
      .json({ status: "error", msg: "Failed to send email." });
  }
});

export default router;
