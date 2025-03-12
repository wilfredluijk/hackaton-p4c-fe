import {Component, OnDestroy, OnInit} from '@angular/core';
import {RxStompService} from "../stomp/rx-stomp.service";
import {Subject} from "rxjs";
import {ContestantQuestionAnswer, ContestantQuizState} from "../model/contestants-update";
import {LeaderboardStateService} from "./leaderboard/leaderboard-state.service";
import {QuizManagerService} from "./quiz-manager.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.css'], animations: [
    trigger('listAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ])]
})
export class QuizManagerComponent implements OnInit, OnDestroy {

  alerts: any[] = [];

  // Subscription status
  public subscribed: boolean = false;
  // @ts-ignore
  private subscription: Subscription;
  private _success = new Subject<string>();
  successMessage: string = '';
  public contestantUpdate: ContestantQuizState[] = [];


  ngOnInit(): void {
    this.subscribed = false;
    this.subscribe();

    this._success.subscribe((message) => {
      this.alerts.push({
        type: 'info',
        msg: message,
        timeout: 5000
      });
      this.successMessage = message;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  constructor( private router: Router, private rxStompService: RxStompService, private stateService: LeaderboardStateService, private quizManagerService: QuizManagerService, private snackbar: MatSnackBar) {

  }

  public subscribe() {
    if (this.subscribed) {
      return;
    }
    this.subscription = this.rxStompService.watch('/topic/gameManagerUpdate').subscribe(this.on_next);
    this.subscribed = true;
  }

  public unsubscribe() {
    if (!this.subscribed) {
      return;
    }

    this.subscription.unsubscribe();
    this.subscribed = false;
  }

  public on_next = (message: any) => {
    const msg: ContestantQuizState[] = JSON.parse(message.body);

    console.log("Contestantupdate ", message, msg)
    this.contestantUpdate = msg.filter(contestant => contestant.connected);
    this.stateService.updateSubject();

  }

  questionCorrect(questionId: number, answeredQuestions: ContestantQuestionAnswer[] = []): boolean {
    return answeredQuestions.filter((answer) => answer.questionId === questionId && answer.correct).length > 0;
  }

  hasAnsweredQuestion(questionId: number, answeredQuestions: ContestantQuestionAnswer[] | undefined): boolean {
    return answeredQuestions?.some((answer) => answer.questionId === questionId) ?? false;
  }

  getScore(questionId: number, answeredQuestions: ContestantQuestionAnswer[] | undefined) {
    return answeredQuestions?.filter((answer) => answer.questionId === questionId)
      .map((answer) => answer.score)
      .reduce((a, b) => a + b, 0);
  }

  removeContestant(update: ContestantQuizState) {
    this.quizManagerService.blockPlayer(update?.contestant?.id).then(_ =>
      this.snackbar.open("Player blocked"));
  }

  visibleChildElements: number[] = [];

  hideChild(update: ContestantQuizState) {
    this.visibleChildElements.push(update.id);
  }

  showChild(update: ContestantQuizState) {
    this.visibleChildElements = this.visibleChildElements.filter(id => id !== update.id);
  }

  childVisible(update: ContestantQuizState) {
    return this.visibleChildElements.some(el => el === update.id);
  }
}
