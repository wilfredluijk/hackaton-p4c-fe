export interface ContestantMessage {
  uid: string;
  state: QuizState
  payload: any;
  answeredQuestions?: number[];
}

export enum QuizState {
  DISCONNECTED = "DISCONNECTED",
  CONNECTED = "CONNECTED",
  STARTED = "STARTED",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
  UNDEFINED = "UNDEFINED",
  BLOCKED = "UNDEFINED"
}
