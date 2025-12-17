const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// -------- PUBLIC ROUTES --------
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

// -------- PROTECTED ROUTES --------
router.get("/me", auth, controller.me);


router.get("/admin-test", auth, role("ADMIN"), (req, res) => {
  res.json({ message: "Welcome ADMIN 👑" });
});

// EMPLOYER only
router.get("/employer-test", auth, role("EMPLOYER"), (req, res) => {
  res.json({ message: "Welcome EMPLOYER 🏢" });
});

// CANDIDATE only
router.get("/candidate-test", auth, role("CANDIDATE"), (req, res) => {
  res.json({ message: "Welcome CANDIDATE 👤" });
});

module.exports = router;
