const { PORT, BASE_URL } = require("./utils/getEnv");
const express = require("express");
const cors = require("cors");
const path = require("path");

const booksRouter = require("./routes/library.routes");
const quizesRouter = require("./routes/quizes.routes");
const authRouter = require("./routes/auth.routes");

const app = express();

// middlewres
app.use(cors());
app.use(express.json());

// app routes
app.use("/pdf", express.static(path.join(__dirname, "pdf")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/books", booksRouter);
app.use("/api/quizes", quizesRouter);
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${BASE_URL}`);
});
