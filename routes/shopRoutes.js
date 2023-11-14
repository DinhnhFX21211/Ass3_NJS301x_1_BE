const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const isAuth = require("../middleware/is-auth");
const { addToCartValidation, orderValidation } = require("./validation");

router.post(
  "/add-to-cart",
  addToCartValidation,
  isAuth,
  shopController.addToCart
);

//order send email
router.post("/orders", orderValidation, isAuth, shopController.order);

//getOrderDetail
router.get("/orders/:orderId", isAuth, shopController.getOrderDetail);

//getOrderOfUser
router.get("/user/orders", isAuth, shopController.getOrderOfUser);

//getCartItem
router.get("/user/cart", isAuth, shopController.getCartItem);

//setQuantityItemInCart
router.post(
  "/user/change-item-quantity",
  isAuth,
  shopController.setQuantityItemInCart
);

//removeItemFromCart
router.post("/user/cart/remove", isAuth, shopController.removeItemFromCart);

module.exports = router;
