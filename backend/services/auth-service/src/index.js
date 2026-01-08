require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use("/auth", require("./routes/auth.routes"));

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.send("Auth service running 🚀");
});

// Start server (LAST)
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
