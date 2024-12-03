import { Server } from "socket.io";
// import express from "express";

// const app = express();


// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost'], // Allowed origins
//   credentials: true, // Allow cookies to be sent
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'], // Allowed headers
// }));

const io = new Server({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost'], // Allowed origins for Socket.IO
    methods: ['GET', 'POST'], // Allowed methods for Socket.IO
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'], // Allowed headers for Socket.IO
    credentials: true, // Allow cookies and credentials in Socket.IO
  },
});

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,
// }))

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUser)
  });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log(`User with id ${receiverId} is not online`);
      socket.emit("error", { message: `User with id ${receiverId} is not online` });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");