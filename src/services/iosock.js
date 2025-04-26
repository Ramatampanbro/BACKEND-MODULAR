const { Server } = require("socket.io");


const iosoc = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

iosoc.on("connection", (socket) => {
  console.log("User connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


module.exports = {iosoc}