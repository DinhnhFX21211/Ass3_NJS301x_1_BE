const Order = require("../models/Order");
const User = require("../models/User");
const createError = require("../utils/ErrorHandle");

//Board admin page
exports.getInfoBoard = async (req, res, next) => {
  try {
    const userAmount = await User.find({}).countDocuments();
    const sumOfOrder = await Order.find({}).countDocuments();
    //Revenue Total: Price total of Order(status: OK; delivery: OK )
    const sumOfRevenue = await Order.aggregate([
      {
        $match: {
          status: "OK",
          delivery: "OK",
        },
      },
      { $group: { _id: null, price: { $sum: "$price" } } },
    ]);
    //15 recentOrders
    const recentOrders = await Order.find({}).sort({ orderTime: -1 }).limit(15);
    res.status(200).send({
      userAmount,
      sumOfOrder,
      sumOfRevenue: sumOfRevenue[0]?.price,
      recentOrders,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Show Order details
exports.getOrderDetails = (req, res, next) => {
  const orderId = req.params.orderID;
  console.log(orderId);
  Order.findOne({ _id: orderId })
    .populate("products.productId")
    .then((result) => {
      if (!result) {
        createError(404, "This order can not be found");
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//update Order(status, delivery)
exports.updateOrder = (req, res, next) => {
  const { orderId, status, delivery } = req.body;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        createError(404, "Order can not be found");
      }
      order.status = status;
      order.delivery = delivery;
      return order.save();
    })
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
