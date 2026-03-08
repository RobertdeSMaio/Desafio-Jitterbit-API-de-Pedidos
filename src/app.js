require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const orderRoutes = require("./routes/orderRoutes");

// Importação opcional para documentação (Recurso Adicional)
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

const app = express();

// 1. Middlewares Globais
app.use(express.json()); // Essencial para receber o JSON do pedido no body

// 2. Definição de Rotas
// Conforme os requisitos: URL base http://localhost:3000/order
app.use("/order", orderRoutes);

// Rota de documentação (Opcional - agrega valor ao seu GitHub)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Inicialização do Banco de Dados e Servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Autentica e Sincroniza os Modelos com o Banco SQL
    await sequelize.authenticate();
    console.log("Conexão com o banco SQL estabelecida com sucesso.");

    // sync() cria as tabelas se elas não existirem (Cuidado em produção)
    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse: http://localhost:${PORT}/order`);
    });
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
  }
}

startServer();
