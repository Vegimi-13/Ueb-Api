require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));

app.listen(process.env.PORT, () =>
  console.log(`Auth service running on port ${process.env.PORT}`)
);

app.get("/", (req, res) => {
  res.send("Auth service running, congratz");
});
