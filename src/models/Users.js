const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../models/Users");

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      // 1. Busca o usuário no banco
      const user = await Users.findByPk(username);

      if (!user) {
        return res.status(401).json({ message: "Login inválido!" });
      }

      // 2. Compara a senha com o hash salvo
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Login inválido!" });
      }

      // 3. Gera o token
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ auth: true, token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno", message: error.message });
    }
  }
}

module.exports = new AuthController();
