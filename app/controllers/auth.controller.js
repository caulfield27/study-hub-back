const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUser } = require("../models/auth.model");
const { JWT_SECRET } = require("../utils/getEnv");

module.exports = {
  registrUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.status(400).send({
          message: `Неверно заполнены поля ${!username ? "username" : ""} ${
            !email ? "email" : ""
          } ${!password ? "password" : ""}`,
        });
      }

      const hashedPw = await bcrypt.hash(password, 10);
      await createUser(username, email, hashedPw);
      res.status(201).send({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      const status = e?.status ?? 500;
      const message = e?.message ?? "Ошибка сервера";
      res.status(status).send({ message });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await findUser(username);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).send({ message: "Неверный пароль" });
      }
      const token = jwt.sign(
        { username, email: user.email, id: user.id },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res
        .status(200)
        .send({ data: token, message: "Пользователь успешно вошел в систему" });
    } catch (err) {
      const status = err?.status ?? 500;
      const message = err?.message ?? "Ошибка сервера";
      res.status(status).send({ message });
    }
  },
  getMe: async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token)
        res.status(401).send({ message: "Пользователь не авторизован" });

      const user = jwt.verify(
        token.startsWith("Bearer") ? token.split(" ")[1] : token, JWT_SECRET
      );
      
      res.status(200).send({ data: user });
    } catch (e) {
      console.error(e);
      res.status(401).send({ message: "Пользователь не авторизован" });
    }
  },
};
