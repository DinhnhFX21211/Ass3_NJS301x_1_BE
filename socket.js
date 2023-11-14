let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://ass3admin.onrender.com",
        ],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw Error("Socket.io not initialized");
    }
    return io;
  },
};
