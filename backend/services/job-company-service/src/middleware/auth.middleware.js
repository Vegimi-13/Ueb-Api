const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("---- AUTH MIDDLEWARE HIT ----");
  console.log("Authorization header:", req.headers.authorization);
  console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
   console.log("TOKEN STRING:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
     console.log("DECODED TOKEN:", decoded);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
