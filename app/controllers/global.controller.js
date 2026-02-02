const { getSearchResult } = require("../models/globals.model");

module.exports = {
  globalSearch: async (req, res) => {
    const { q } = req.query;
    try {
      const data = await getSearchResult(q ?? "");
      const total = data.books.length+data.courses.length+data.quizes.length;
      res.status(200).send({ data, total });
    } catch (e) {
      res.status(500).send({ message: "Ошибка сервера: " + e?.message ?? "" });
    }
  },
};
