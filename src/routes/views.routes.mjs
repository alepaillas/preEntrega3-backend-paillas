import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  // si existe una sesión mostramos el nombre de usuario, sino lo seteamos como anon
  if (req.session.user) {
    res.render("index", {
      style: "output.css",
      user: req.session.user,
      isAdmin: req.session.user.role === "admin",
    });
  } else {
    res.render("index", {
      style: "output.css",
      user: {first_name: "anon"},
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login", {
    style: "output.css",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    style: "output.css",
  });
});

export default router;
