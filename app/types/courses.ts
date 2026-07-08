export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  slug: string;
  poster: string;
  author: string;
  name: string;
  description: string;
  language: string;
  duration: string;
  is_free: boolean;
  price: number;
  rating_avg: number;
  reviews_count: number;
  created_at: Date;
  categories: Category[];
  lessons?: unknown;
}

export interface CourseReview {
  id: number;
  course_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  username?: string;
}

export interface CourseWithReviews extends Course {
  reviews: CourseReview[];
}

export interface CoursesQuery {
  sort?: string;
  category?: string;
  price?: string;
  rating?: string;
  lang?: string;
}

export interface CourseReviewRequestBody {
  course_id: number;
  user_id: number;
  rating: number;
  comment?: string;
}

export interface NewReview {
  id: number;
  created_at: Date;
}

export interface CourseLesson {
  name: string;
  duration: string;
  path: string;
}

export interface CoursePayload {
  slug: string;
  poster: string;
  name: string;
  author: string;
  description: string;
  language: string;
  duration: string;
  is_free: boolean;
  price: number | null;
  categoryIds: number[];
  lessons: CourseLesson[];
}
