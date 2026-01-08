require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cors = require('cors');


//const authMiddleware = require("./middleware/auth.middleware");

const express = require("express");
const app = express();
app.use(cors());

app.use(express.json());

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
//app.use(authMiddleware);

const PORT = process.env.PORT || 4003;
const applicationRoutes = require("./routes/application.routes");
app.use("/", applicationRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Application Service listening on port ${PORT}`);
});
