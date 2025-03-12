export interface RequestStartMessage {
  uid: string;
}

export interface SubmitAnswerMessage {
  uid: string;
  questionId: number;
  answer: string[];
}
