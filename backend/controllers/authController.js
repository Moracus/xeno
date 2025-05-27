import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as dotenv from "dotenv";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  const token = credential;

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      // Create new user
      user = new User({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign({ id: user._id, user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Redirect with token
    res.redirect(`${process.env.FRONTEND_URL}/?token=${jwtToken}`);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid Google Token" });
  }
};
