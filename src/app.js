require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const sequelize = require("./config/database");
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");
const Item = require("./models/Item");

// 1. Relacionamentos
Order.hasMany(Item, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});
Item.belongsTo(Order, { foreignKey: "orderId" });

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API Pedidos", version: "1.0.0" },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// 3. Middlewares
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/order", orderRoutes);

// 4. Inicialização Segura
async function startServer() {
  try {
    // Autentica no Neon via Sequelize
    await sequelize.authenticate();
    console.log("Conexão com Neon/PostgreSQL confirmada.");

    // Sincroniza tabelas
    await sequelize.sync({ force: false });
    console.log("Tabelas sincronizadas.");

    // Sobe o servidor Express (apenas uma vez)
    app.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
      console.log(`Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Falha na infraestrutura:", error.message);
    process.exit(1);
  }
}

startServer();
