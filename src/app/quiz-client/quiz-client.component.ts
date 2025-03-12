import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxClientStompService} from "../stomp/rx-client-stomp.service";
import {myRxStompConfig} from "../stomp/my-rx-stomp.config";
import {DeviceUtil} from "./device-util";
import {RequestStartMessage, SubmitAnswerMessage} from "../messages/request-start-message";
import {ContestantMessage, QuizState} from "./contestant-message";
import {Subscription} from "rxjs";
import {Question} from "../model/question";
import {QuizSummary} from "../model/quiz-summary";

@Component({
  selector: 'app-quiz-client',
  templateUrl: './quiz-client.component.html',
  styleUrls: ['./quiz-client.component.css'],
  providers: [RxClientStompService]
})
export class QuizClientComponent implements OnInit, OnDestroy {
  name: string | undefined;
  private stompSubscription: Subscription | undefined;
  private identifier: string | undefined;
  private subscribed: boolean = false;
  state: QuizState = QuizState.DISCONNECTED;
  public questions: Question[] = [];
  activeQuestion: Question | undefined;
  summary: QuizSummary | undefined;
  progress: number = 0;

  constructor(private stompService: RxClientStompService) {
  }

  ngOnInit(): void {
    this.identifier = localStorage.getItem('deviceIdentifier') ?? undefined;
    if (!this.identifier) {
      this.identifier = DeviceUtil.generateDeviceIdentifier();
      localStorage.setItem('deviceIdentifier', this.identifier);
      console.log('Generated new device identifier: ', this.identifier);
    }
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  confirmName() {
    if (this.name) {
      if (this.identifier) {
        const updateName: any = {uid: this.identifier, name: this.name};
        this.stompService.publish({destination: "/app/updateName", body: JSON.stringify(updateName)});
      }
    }
  }

  public subscribe() {
    const myRxStompConfig1 = myRxStompConfig;
    // @ts-ignore
    myRxStompConfig1.connectHeaders['uid'] = this.identifier;
    this.stompService.configure(myRxStompConfig1);
    this.stompService.activate();


    if (this.identifier) {
      this.stompSubscription = this.stompService.watch('/topic/gameclientupdate').subscribe(update => this.on_next(update));
    }

    this.subscribed = true;
  }

  public startQuiz() {
    if (this.identifier) {
      const requestStart: RequestStartMessage = {uid: this.identifier}
      this.stompService.publish({destination: "/app/requestStart", body: JSON.stringify(requestStart)});
    }
  }


  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    this.stompSubscription?.unsubscribe();
    this.subscribed = false;
  }

  private on_next(message: any) {
    const contestantMessage: ContestantMessage = JSON.parse(message.body);
    if (contestantMessage.uid === this.identifier) {
      switch (contestantMessage.state) {
        case QuizState.DISCONNECTED:
          break;
        case QuizState.BLOCKED:
          break;
        case 'CONNECTED':
          this.state = QuizState.CONNECTED;
          break;
        case QuizState.STARTED:
          this.state = QuizState.STARTED;
          this.questions = contestantMessage.payload as Question[];
          const answeredQuestions = contestantMessage.answeredQuestions;
          if (answeredQuestions) {
            this.activeQuestion = this.questions[answeredQuestions.length];
          } else {
            this.activeQuestion = this.questions[0];
          }
          break;
        case QuizState.RUNNING:
          this.state = QuizState.RUNNING;
          break;
        case QuizState.FINISHED:
          this.state = QuizState.FINISHED;
          this.summary = contestantMessage.payload as QuizSummary;
          break;
      }
    }

    const index = this.questions.findIndex(q => q.id === this.activeQuestion?.id);
    this.setProgress(index);
  }

  startGame() {
    this.startQuiz();
  }

  answerSubmitted($event: string[]) {
    if (this.identifier) {
      const answer: SubmitAnswerMessage = {
        uid: this.identifier,
        answer: $event,
        questionId: this.activeQuestion?.id ?? -1
      };
      this.stompService.publish({destination: "/app/giveAnswer", body: JSON.stringify(answer)});
    }
    const index = this.questions.findIndex(q => q.id === this.activeQuestion?.id);
    if (index === this.questions.length - 1) {
      this.activeQuestion = undefined;
    } else {
      const newIndex = index + 1;
      this.setProgress(index);
      this.activeQuestion = this.questions[newIndex];
    }

  }

  private setProgress(index: number) {
    const questionCount = this.questions.length - 1;
    this.progress = 100 * index / questionCount
  }
}
