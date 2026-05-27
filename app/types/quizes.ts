export interface QuizSummary {
  id: number;
  name: string;
  complexity: string;
  img: string;
}

export interface Quiz {
  id: number;
  name: string;
  complexity: string;
  img: string;
  recommended: boolean;
  [key: string]: unknown;
}
