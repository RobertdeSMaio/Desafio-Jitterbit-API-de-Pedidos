const { Sequelize } = require("sequelize");

// O Sequelize prioriza a DATABASE_URL se ela existir, caso contrário usa os campos separados
const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
  },
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necessário para evitar erro de certificado no Neon
      },
    },
    logging: false, // Defina como console.log para debugar queries SQL
  },
);

module.exports = sequelize;
