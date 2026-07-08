import { PORT, BASE_URL } from "./utils/getEnv";
import express from "express";
import cors from "cors";

import booksRouter from "./routes/library.routes";
import quizesRouter from "./routes/quizes.routes";
import authRouter from "./routes/auth.routes";
import globalRouter from "./routes/global.routes";
import coursesRouter from "./routes/courses.routes";
import usersRouter from "./routes/users.routes";

const app = express();

// middlewres
app.use(cors());
app.use(express.json({limit: '50mb'}));

// app routes
app.use("/api/books", booksRouter);
app.use("/api/quizes", quizesRouter);
app.use("/api/courses", coursesRouter);
app.use('/api/users',usersRouter);
app.use("/api/search", globalRouter);
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${BASE_URL}`);
});
