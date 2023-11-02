const logger = require("./logger/logger.util");

let ioObj;
let connectedUsers = {};
const connect = (io) => {
  ioObj = io;
  io.on("connection", (socket) => {
    // Store the user ID when the user connects
    socket.on("userConnected", (userId) => {
      connectedUsers[socket.id] = userId.toLowerCase();
      // socket connnected
    });

    socket.on("disconnect", () => {
      // Remove the user ID when the user disconnects
      removeUser(socket.id);
    });

    socket.on("message", (msg) => {
      io.emit("notifyMe/3", msg);
    });
  });
};

const removeUser = (socketId) => {
  delete connectedUsers[socketId];
};

const notificationCountSend = (userId) => {
  for (const key of Object.keys(connectedUsers)) {
    if (connectedUsers[key] == userId.toString()) {
      ioObj.to(key).emit("notificationCount","new notification");
      logger.info("socket working--------------------------------------------");
    } else {
      logger.info("user not found");
    }
  }
};

module.exports = { connect, notificationCountSend };
