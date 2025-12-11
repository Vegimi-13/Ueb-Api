const bcrypt = require("bcrypt");
const prisma = require("../prisma/prisma");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

module.exports = {
  async register(req, res) {
    const { email, password, role } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash: hashed, role },
    });

    res.json({ message: "User registered", user });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  },

  async me(req, res) {
    res.json({ user: req.user });
  },
};
