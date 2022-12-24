//importing from node
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// end of imports

/**
 * @params string @returns boolean
 * @desc validating phone number according to indian format
 */

const validatePhoneNumber = function(phonenumber) {
  const re = /^[6-9]\d{9}$/;
  return re.test(phonenumber);
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"]
    },
    phonenumber: {
      type: String,
      required: [true, "Please tell us your email"],
      validate: [validatePhoneNumber, "Please fill a valid phone number"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords are not the same!"
      }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changePasswordAfter = function(JWTtimeStamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTtimeStamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
