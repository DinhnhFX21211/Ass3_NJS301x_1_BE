let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: [
          `${process.env.ORIGIN_FE_client}`,
          `${process.env.ORIGIN_FE_admin}`,
          "http://localhost:3000",
          "http://localhost:3001",
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
