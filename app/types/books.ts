export interface Book {
  id: number;
  name: string;
  author: string;
  image: string;
  pdf: string;
  rating: number;
  rating_avg: number;
  reviews_count: number;
  released: string;
  description: string;
}

export type Suggestion = Omit<Book, 'rating' | 'rating_avg' | 'reviews_count' | 'id'>

export interface BookReview {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  username?: string;
}

export interface BookWithReviews extends Book {
  reviews: BookReview[];
}

export interface BookInsert {
  name: string;
  author: string;
  image: string;
  pdf: string;
  rating_avg: number;
  released: string;
  description: string;
}

export interface BooksResult {
  data: Book[];
  total: number;
}

export interface ReviewRequestBody {
  book_id: number;
  user_id: number;
  rating: number;
  comment?: string;
}

export interface NewReview {
  id: number;
  created_at: Date;
}
