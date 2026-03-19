import CryptoJS from "crypto-js"; // 64.9k (gzipped: 24.2k)
import JWT from "jsonwebtoken"; // 55.4k (gzipped: 16.4k)
import { IUser } from "../../interfaces/models";

type TokenExpiration = JWT.SignOptions["expiresIn"];

const passwordToHash = (password: string): string => {
  return CryptoJS.HmacSHA256(
    password,
    CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH!).toString(),
  ).toString();
};

const generateAccessToken = (
  user: IUser,
  expiresIn: TokenExpiration = "1w",
): string => {
  return JWT.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn,
  });
};

const generateRefreshToken = (user: IUser): string => {
  return JWT.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: "1y",
  });
};

export { passwordToHash, generateAccessToken, generateRefreshToken };
