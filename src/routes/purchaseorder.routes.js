// importing from node
import express from "express";

// importing from service
import { protect, restrictTo } from "../service/auth.service";
import {
  addBalanceAdmin,
  getUserBalance
} from "../service/purchaseOrder.service";

/**
 * Routes in this file
 * @route /
 * @route /addBalanceAdmin
 */
const router = express.Router();

router.use(protect);
router.route("/").get(getUserBalance);
router.route("/addBalanceAdmin").post(restrictTo("admin"), addBalanceAdmin);

export default router;
