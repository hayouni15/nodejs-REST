import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    const authorized = jwt.verify(token, "thisisasecretstring");
    const user = await User.findOne({
      _id: authorized.user,
      "tokens.token": token,
    });
    user.token = token;
    req.user = user;
    if (user) {
      next();
    } else {
      res.status(403).send("unvalid token. Sign in again");
    }
  } catch (error) {
    res.send("you are not authorized to access this endpoint");
  }
};

export { auth };
