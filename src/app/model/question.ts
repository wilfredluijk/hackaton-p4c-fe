export interface Question {
  id: number;
  title: string;
  questionType: string;
  question: string;
  answerOptions: string[];
  correctAnswer: string[];
}
