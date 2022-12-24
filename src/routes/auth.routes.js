// importing from node
import express from "express";

// importing from service
import { signUp, login } from "../service/user.service";

// end of imports

/**
 * Routes in this file
 * @route /signup
 * @route /login
 */
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

export default router;
