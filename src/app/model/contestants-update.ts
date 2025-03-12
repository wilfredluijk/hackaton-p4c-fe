export interface ContestantQuizState {
  id: number;
  contestant: Contestant;
  questionIds: number[];
  answeredQuestions: ContestantQuestionAnswer[];
  startedAt: Date;
  connected: boolean;
  finishedAt: Date;
  name: string;
  totalTimeSpendInMillis: number;
}

export interface Contestant {
  id: number;
  uid: string;
  name: string;
  sessionId: string;
}

export interface ContestantQuestionAnswer {
  id: number;
  contestant: Contestant;
  questionId: number;
  answer: string[];
  answeredAt: Date;
  correct: boolean;
  score: number;
}
