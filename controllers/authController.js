const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const createError = require("../utils/ErrorHandle");

//signup
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  bcrypt
    .hash(req.body.password, 12)
    .then((hashedPassword) => {
      const userData = {
        email: req.body.email,
        password: hashedPassword,
        fullName: req.body.fullName,
        phone: req.body.phone,
        role: req.body.role,
        cart: { items: [] },
      };
      const user = new User(userData);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User Created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//login
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role || "CUSTOMER";
  let loadedUser;
  User.findOne({ email: email })
    .populate("cart.items.productId", "img1 name price")
    .then((user) => {
      if (!user) {
        createError(401, "User with this email could not be found!");
      }
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      loadedUser = { ...user._doc, cart: { items: products } };
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        createError(401, "Wrong password!");
      }
      if (
        role === "CUSTOMER" ||
        (role === "ADMIN" &&
          (loadedUser.role.toString() === "ADMIN" ||
            loadedUser.role.toString() === "Counselor"))
      ) {
        req.session.isLoggedIn = true;
        req.session.user = loadedUser;
        return req.session.save((err) => {
          res.status(200).json({
            user: loadedUser,
          });
        });
      } else {
        createError(401, "User do not have this role");
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//get CurrentUser
exports.getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user._id }, "email fullName phone role")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//logout
exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.status(200).send({ status: "success" });
  });
};
