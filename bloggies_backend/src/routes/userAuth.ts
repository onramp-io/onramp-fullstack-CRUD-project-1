import express, { NextFunction, Request, Response } from "express";
import ExpressError from "../expressError";
import UserAuth from "../models/userAuth";
import User from "../models/user";

export const userAuthRouter = express.Router();

/** POST /user-auth/register - creates a new user. 
 * Returns user object & a jwt cookie */
userAuthRouter.post("/register", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, display_name } = req.body;
    let membershipStatus = "pending"; // TODO: create a helper function to verify questions to provide membership status

    if (email && password && display_name) {
      const authResult = await UserAuth.register(email, password);
      await User.createUser(authResult.user.id, display_name, membershipStatus);

      const respObject = {
        user: {
          ...authResult.user,
          display_name,
          membership_status: membershipStatus,
          membership_start_date: null,
          membership_end_date: null,
          last_submission_date: null
        }
      };
      res.cookie("token", authResult.token);

      return res.status(201).json(respObject);
    }
    console.log("register event with: ", email, display_name);
    throw new ExpressError("Invalid registration values. Check all fields.", 400);
  } catch (err) {
    return next(err);
  }
});

/** POST /user-auth/login - authenticate credentials and login a user. 
 * Returns user object & a jwt cookie*/
userAuthRouter.post("/login", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const authResult = await UserAuth.authenticate(email, password);
    const user = await User.getUser(authResult.user.id);

    res.cookie("token", authResult.token);
    
    return res.json({ user: { ...user, email } });
  } catch (err) {
    return next(err);
  }
});