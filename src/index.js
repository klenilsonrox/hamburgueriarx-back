import express from 'express';
import cors from 'cors';
import axios from "axios"
import { createServer } from 'http'; // Importar para criar o servidor HTTP
import { Server } from 'socket.io';  // Importar o Socket.io
import RouterCategory from './routes/category-routes.js';
import RouterUsers from './routes/user-routes.js';
import RouterProducts from './routes/product-route.js';
import { connectDBMongoose } from './database/conndb.js';
import RouterOrders from './routes/order-routes.js';

const port = process.env.PORT || 4001;
const app = express();
const server = createServer(app); // Cria o servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // URL do seu frontend
    methods: ["GET", "POST","PUT"]
  }
});

app.use(express.json());
app.use(cors());

connectDBMongoose()


app.use("/api", RouterCategory)
app.use("/api", RouterUsers)
app.use("/api", RouterProducts)
app.use("/api", RouterOrders)



// Evento para conexão do Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Evento customizado de desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar o servidor usando o server com Socket.io
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export { io }; // Exporta o Socket.io para usar nas rotas
