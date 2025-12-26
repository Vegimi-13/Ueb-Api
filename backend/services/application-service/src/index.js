require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authMiddleware = require("./middleware/auth.middleware");

const express = require("express");
const app = express();

app.use(express.json());
app.use(authMiddleware);

const PORT = process.env.PORT || 4003;
const applicationRoutes = require("./routes/application.routes");
app.use("/", applicationRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Application Service listening on port ${PORT}`);
});
