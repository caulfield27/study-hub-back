export interface QuizSummary {
  id: number;
  name: string;
  complexity: string;
  img: string;
  lang: string;
  recommended: boolean;
}

export interface Quiz {
  id: number;
  name: string;
  complexity: string;
  img: string;
  lang: string;
  recommended: boolean;
  [key: string]: unknown;
}

export interface QuizPayload {
  name: string;
  complexity: number;
  img: string;
  lang: string;
  recommended: boolean;
  questions: unknown;
}
