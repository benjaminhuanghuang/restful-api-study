import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePassword = (password, hash) => {
  // return a promise
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  // return a promise
  return bcrypt.hash(password, 10);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({ message: "You are not authorized" });
    return;
  }
  // split the bearer token "bearer token" => ["bearer", "token"]
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401).json({ message: "not valid token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "not valid token" });
  }
};
