// importing from common
import AppError from "../common/AppError";
import CatchAsync from "../common/CatchAsync";
import { MobileRes } from "../common/MobileApiRes";

// importing from model
import AccountModel from "../model/account.model";
import PurchaseOrderModel from "../model/purchaseOrder.model";
import UserModel from "../model/user.model";

// end of imports

/**
 * @param {*} method String
 * @param {*} userId mongoose.Schema.Types.ObjectId
 * @returns mongoose.Schema.Types.ObjectId
 * @description it is used for check method and create account
 */

async function checkAndCreateMethod(method, userId) {
  const accountObj = await AccountModel.findOne({ user: userId, upi: method });
  if (accountObj) {
    return accountObj._id;
  }
  const createAccountObj = await AccountModel.create({
    user: userId,
    upi: method
  });

  return createAccountObj._id;
}

/**
 * @description for adding balance by admin
 */
export const addBalanceAdmin = CatchAsync(async (req, res, next) => {
  const { amount, phonenumber, method } = req.body;
  if (!amount) {
    next(new AppError("please provide amount", 400, true));
  }
  if (!phonenumber) {
    next(new AppError("please provide phonenumber of the user", 400, true));
  }
  if (!method) {
    next(new AppError("Please provide upi of the user", 400, true));
  }
  const userObj = await UserModel.findOne({ phonenumber });

  if (!userObj) {
    next(
      new AppError("there is no user associated with these email", 400, true)
    );
  }
  const /** @const mongoose.Schema.Types.ObjectId*/
    account = await checkAndCreateMethod(method, userObj._id);

  const /** @const Object*/
    purchaseOrderObj = await PurchaseOrderModel.create({
      account,
      amount,
      user: userObj._id
    });

  return res
    .status(201)
    .json(
      new MobileRes(
        "User Balance updated successfully",
        purchaseOrderObj,
        req.baseHeaders
      )
    );
});

/**
 *
 * @param {*} userId Mongoose.Types.ObjectId
 * @returns array of objects
 */
async function getActivePurchaseOrder(userId) {
  const query = [
    {
      $match: {
        user: userId,
        $expr: {
          $gte: [{ $subtract: ["$amount", "$usedAmount"] }, 0]
        }
      }
    },
    {
      $project: {
        balance: { $subtract: ["$amount", "$usedAmount"] },
        totalAmount: 1,
        usedAmount: 1,
        _id: 1
      }
    }
  ];
  const purchaseOrderObj = await PurchaseOrderModel.aggregate(query);
  return purchaseOrderObj;
}

async function calculateUserBalance(userId) {
  const activePurchaseOrderList = await getActivePurchaseOrder(userId);
  let balance = 0;
  if (activePurchaseOrderList.length > 0) {
    activePurchaseOrderList.forEach(i => {
      balance += i.balance;
    });
  }
  return balance;
}
/**
 * @description get user Balance
 */
export const getUserBalance = CatchAsync(async (req, res, next) => {
  const balance = await calculateUserBalance(req.user._id);
  return res
    .status(200)
    .json(
      new MobileRes(
        "Balance Fetched Successfully",
        { balance },
        req.baseHeaders
      )
    );
});
