import express from "express";
import { loginPage } from "../service/view.service";

const router = express.Router();

router.get("/login", loginPage);

export default router;
