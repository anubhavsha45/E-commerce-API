const User = require("./../models/User");
const AppError = require("./../utils/errorClass");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.registerUser = catchAsync(async (req, res, next) => {
  //Take all the required details from the user
  const { name, email, password, passwordConfirm } = req.body;
  //Give the error as response if the user dont give required details
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError("Please fill all the details", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  //create the json web token
  const token = generateToken(user._id);

  //SEND THE TOKEN AS A RESPONSE

  return res.status(201).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  //take the email and password from the user
  const { email, password } = req.body;
  //throw the error if they dont provide email and password
  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 400));
  }
  //now check whether what they provided is correct or not

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(
      new AppError("Your credentials are incorrect ! please try again", 401),
    );
  }

  //generate the token

  const token = generateToken(user._id);

  //send the response

  return res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in,Please log in to continue", 401),
    );
  }

  //verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );

  //chekc if current user exists

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user is not logged in anymore or his token has expired",
        401,
      ),
    );
  }
  //attach the user to req.user if he still exists
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to do this task", 401),
      );
    }

    next();
  };
};
