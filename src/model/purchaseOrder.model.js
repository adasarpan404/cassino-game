import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account"
    },
    amount: {
      type: Number,
      required: [true, "Please tell us amount"]
    },
    usedAmount: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    type: {
      type: String,
      enum: ["purchased", "winning"],
      default: "purchased"
    }
  },
  {
    timestamps: true
  }
);

const PurchaseOrderModel = new mongoose.model(
  "purchaseorder",
  purchaseOrderSchema
);

export default PurchaseOrderModel;
