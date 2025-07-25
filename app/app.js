require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const booksRouter = require("./routes/library.routes");
const quizesRouter = require("./routes/quizes.routes");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/books", booksRouter);
app.use("/api/quizes", quizesRouter);


const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Сервер запущен на ${process.env.BASE_URL ?? ""}`);
});