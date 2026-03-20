const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must provide his name"],
  },
  email: {
    type: String,
    required: [true, "A user must provide his email address"],
  },
  password: {
    type: String,
    required: [true, "A user should must have a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "Passwords should match in both the fields",
    },
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
//PRE SAVE MIDDLEWARE
userSchema.pre("save", async function (next) {
  //Return to the next middlware if the password is not modified
  if (!this.isModified("password")) {
    return next();
  }
  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //remove the password confirm field
  this.passwordConfirm = undefined;
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
