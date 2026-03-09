const Order = require("../models/Order");
const Item = require("../models/Item");

class OrderController {
  // Criar um novo pedido
  async create(req, res) {
    try {
      const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

      const orderMapped = {
        orderId: numeroPedido,
        value: valorTotal,
        creationDate: new Date(dataCriacao),
        Items: items.map((item) => ({
          productId: item.idItem,
          quantity: item.quantidadeItem,
          price: item.valorItem,
        })),
      };

      const result = await Order.create(orderMapped, {
        include: [{ model: Item }],
      });

      return res.status(201).json({
        message: "Pedido criado com sucesso!",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Falha na criação do pedido",
        message: error.message,
      });
    }
  }

  // Obter dados por parâmetro na URL
  async getById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, { include: [Item] });

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      return res.json(order);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  // Listar todos os pedidos
  async listAll(req, res) {
    try {
      const orders = await Order.findAll({ include: [Item] });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  // Atualizar pedido
  async update(req, res) {
    try {
      const { orderId } = req.params;
      const { numeroPedido, valorTotal, dataCriacao } = req.body;

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      await order.update({
        orderId: numeroPedido ?? order.orderId,
        value: valorTotal ?? order.value,
        creationDate: dataCriacao ? new Date(dataCriacao) : order.creationDate,
      });

      return res.json({
        message: "Pedido atualizado com sucesso!",
        data: order,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Falha na atualização do pedido",
        message: error.message,
      });
    }
  }

  // Deletar pedido
  async delete(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      await order.destroy();
      return res.json({ message: "Pedido deletado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}

module.exports = new OrderController();
