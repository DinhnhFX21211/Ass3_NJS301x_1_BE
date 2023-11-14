const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

//Board admin page
router.get("/info-board", adminController.getInfoBoard);

//Show Order details
router.get("/order/:orderID", isAuth, adminController.getOrderDetails);

//update Order(status, delivery)
router.post("/order/update", isAuth, adminController.updateOrder);

module.exports = router;
