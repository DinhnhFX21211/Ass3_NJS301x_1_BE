const express = require("express");

const router = express.Router();
const messageController = require("../controllers/messageController");

const isAuth = require("../middleware/is-auth");

//getMessageAll admin
router.get("/all", isAuth, messageController.getMessageAll);

//getMessageUser Clien
router.get("/:userId", messageController.getMessageUser);

module.exports = router;
