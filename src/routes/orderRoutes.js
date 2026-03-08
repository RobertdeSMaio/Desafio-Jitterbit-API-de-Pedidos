const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const authMiddleware = require("../middlewares/auth");
const AuthController = require("../controllers/AuthController");

// O usuário precisa enviar o Token para criar um pedido
router.post("/", authMiddleware, OrderController.create);
// Rota para gerar o token
router.post("/login", AuthController.login);
// 1. Criar um novo pedido
// URL: http://localhost:3000/order
router.post("/", OrderController.create);

// 2. Obter dados do pedido por parâmetro
// URL: http://localhost:3000/order/v10089016vdb
router.get("/:orderId", OrderController.getById);

// 3. Listar todos os pedidos
// URL: http://localhost:3000/order/list
// Nota: Definir esta rota ANTES de rotas com parâmetros genéricos se necessário
router.get("/list", OrderController.listAll);

// 4. Atualizar pedido
router.put("/:orderId", OrderController.update);

// 5. Deletar pedido
router.delete("/:orderId", OrderController.delete);

module.exports = router;
