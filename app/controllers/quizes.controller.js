const { selectQuizes, selectQuizById } = require("../models/quizes.model");

module.exports = {
  getQuizes: async (_, res) => {
    try {
      const quizes = await selectQuizes();
      res.status(200).send(quizes);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Не удалось получить данные. Ошибка сервера!" });
    }
  },
  getQuizById: async (req, res) => {
    try {
      const { id } = req.params;
      if(!id){
        res.status(404).send({message: "id не найден"})
      };
      const quiz = await selectQuizById(id);
      res.status(200).send(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Не удалось получить данные. Ошибка сервера!" });
    }
  },
};
