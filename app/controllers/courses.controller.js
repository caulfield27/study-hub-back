const { selectCourses } = require("../models/courses.model");

module.exports = {
  getCourses: async (req, res) => {
    try {
      const courses = await selectCourses();
      res.status(200).send({ data: courses });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Ошибка сервера", data: e?.message ?? "" });
    }
  },
};
