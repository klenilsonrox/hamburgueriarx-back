// socket.js
import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io não foi inicializado!");
  }
  return io;
};
