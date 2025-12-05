const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/getEnv");

module.exports = async function authMiddleware(req, res, next) {
  const token = req.header("Authorization");
  if (!token) res.status(401).send({ message: "Пользователь не авторизован" });
  console.log('token: ', token);
  
  try {
    jwt.verify(token.split(' ')[1], JWT_SECRET);
    next();
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: "Неправильный токен" });
  }
};
