import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    upi: {
      type: String,
      required: [true, "please write upi"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    timestamps: true
  }
);

const AccountModel = mongoose.model("account", accountSchema);

export default AccountModel;
