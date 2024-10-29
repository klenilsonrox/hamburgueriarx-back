import express from 'express';
import cors from 'cors';
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


app.use(express.json());
app.use(cors());

connectDBMongoose()


app.use("/api", RouterCategory)
app.use("/api", RouterUsers)
app.use("/api", RouterProducts)
app.use("/api", RouterOrders)




// Iniciar o servidor usando o server com Socket.io
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


