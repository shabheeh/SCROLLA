import express from "express";
import { userSigin, userSignup } from "../controllers/user.controller";
import {
  validateUserSignin,
  validateUserSignup,
} from "../validators/user.validator";
import asyncWrapper from "../utils/asyncWrapper";

const router = express.Router();

router.post("/signup", validateUserSignup, asyncWrapper(userSignup));
router.post("/signin", validateUserSignin, asyncWrapper(userSigin));

export default router;
