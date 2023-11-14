const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  roomId: String,
  chatsText: [
    {
      from: String,
      text: String,
    },
  ],
});

module.exports = mongoose.model("Message", MessageSchema);
