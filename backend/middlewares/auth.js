import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401), json({ message: "no auth token,access denied" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res?.status(500).json({ error: err.message });
  }
};
