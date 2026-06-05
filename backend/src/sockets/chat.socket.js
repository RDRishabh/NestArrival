const { prisma } = require("../config/db");
const jwt = require("jsonwebtoken");

function parseCookies(cookieHeader) {
  return (cookieHeader || "")
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {});
}

function initChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie || "");
      const token = cookies.nestarrival_session;

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.isBanned) {
        return next(new Error("Unauthorized"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ roomId }) => {
      if (!roomId) return;

      const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room) return;
      if (room.tenantId !== socket.user.id && room.ownerId !== socket.user.id)
        return;

      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ roomId, content }) => {
      if (!roomId || !content || !String(content).trim()) return;

      const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room) return;
      if (room.tenantId !== socket.user.id && room.ownerId !== socket.user.id)
        return;

      const msg = await prisma.chatMessage.create({
        data: {
          roomId,
          senderId: socket.user.id,
          content: String(content).trim(),
        },
      });

      io.to(roomId).emit("message", msg);
    });
  });
}

module.exports = { initChatSocket };
