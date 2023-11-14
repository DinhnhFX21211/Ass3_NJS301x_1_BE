const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const messageRouter = require("./routes/message");
const Message = require("./models/message");
const session = require("express-session");
const User = require("./models/User");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
app.use(
  cors({
    credentials: true,
    origin: [`${process.env.FE_clien}`, "https://ass3admin.onrender.com"],
  })
);

// setting for images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// setup for call api
app.use(express.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);
app.use("/images", express.static(path.join(__dirname, "images")));

// setup for using session and cookie
const MONGODB_URL = `mongodb+srv://dinh:TxsmI8vQwxFLql04@dinh.ieuqqyx.mongodb.net/Ass3`;
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    proxy: true,
    cookie: {
      path    : '/',
      secure: false,
      httpOnly: false,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRouter);
// set up to handle error
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use(helmet());
app.use(compression());

// setup for connect database, socket.io and save messages
mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    console.log("Server listening on port 5000");
    const server = app.listen(5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      socket.on("chat", function (msg) {
        io.emit("chat", msg);
        Message.find({ roomId: msg.roomId })
          .then((message) => {
            if (message.length === 0) {
              const roomId = msg.roomId;
              const chatsText = msg.message;
              const chat = new Message({
                roomId,
                chatsText,
              });
              chat.save();
            } else {
              message[0].chatsText.push(msg.message);
              message[0].save();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
