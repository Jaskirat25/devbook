const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  let users = [];

  const addUser = (username, socketId) => {
    if (!users.some((user) => user.username === username)) {
      users.push({ username, socketId });
    }
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (username) => {
    return users.find((user) => user.username === username);
  };

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("newUser", (username) => {
      addUser(username, socket.id);
      console.log("Active socket users:", users);
    });

    socket.on("sendNotification", ({ receiverUsername, data }) => {
      const receiver = getUser(receiverUsername);
      if (receiver) {
        io.to(receiver.socketId).emit("getNotification", {
          id: Math.random().toString(),
          senderUsername: data.senderUsername,
          type: data.type,
          link: data.link,
        });
        console.log(`Notification sent to ${receiverUsername}:`, data);
      } else {
        console.log(`User ${receiverUsername} not connected.`);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
