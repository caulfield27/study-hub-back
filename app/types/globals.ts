import { Book } from "./books";
import { Course } from "./courses";
import { QuizSummary } from "./quizes";

export interface SearchResult {
  books: Book[];
  quizes: QuizSummary[];
  courses: Course[];
}
