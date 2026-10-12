import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // sets a cookie named jwt in the user’s browser
  // Cookie cannot be accessed by JavaScript
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Cookie is sent only over HTTPS
    sameSite: "strict", // Only sent from same site
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
};
