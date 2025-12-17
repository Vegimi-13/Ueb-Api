require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth.routes"));

app.get("/", (req, res) => {
  res.send("Auth service running 🚀");
});

// Start server (LAST)
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
