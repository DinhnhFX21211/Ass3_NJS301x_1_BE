const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAuth = require("../middleware/is-auth");
const { productFormValidation } = require("./validation");

//getTrendingProducts limit 8 Product
router.get("/trending", productController.getTrendingProducts);

//getAllProducts
router.get("/all", productController.getAllProducts);

//addNewProduct admin
router.post(
  "/create",
  productFormValidation,
  isAuth,
  productController.addNewProduct
);

//getProductDetails
router.get("/:productId", productController.getProductDetails);

//updateProduct admin
router.post(
  "/update",
  productFormValidation,
  isAuth,
  productController.updateProduct
);

//deleteProduct admin
router.delete("/:productId", isAuth, productController.deleteProduct);

module.exports = router;
