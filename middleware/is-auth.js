const throwError = require("../utils/ErrorHandle");

module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
     next();
    // throwError(401, "Unauthenticated");
  }
  next();
};
