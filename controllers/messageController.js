const Message = require("../models/message");

//getMessageUser Clien
exports.getMessageUser = async (req, res, next) => {
  Message.find({ roomId: req.params.userId })
    .then((result) => {
      res.status(200).send(result[0].chatsText);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//getMessageAll admin
exports.getMessageAll = async (req, res, next) => {
  Message.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
