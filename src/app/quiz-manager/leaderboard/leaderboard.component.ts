import { Component } from '@angular/core';
import {LeaderboardStateService} from "./leaderboard-state.service";
import {LeaderboardEntry} from "../../model/leaderboard-entry";
import {QuizManagerService} from "../quiz-manager.service";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  public leaderboardEntries: LeaderboardEntry[] = [];
    constructor(private leaderboardStateService: LeaderboardStateService, private quizManagerService: QuizManagerService) {
      leaderboardStateService.getState().subscribe(update => {
        console.log("update of leaderboard, {}", update)
        this.leaderboardEntries = update
      });
    }


  removeEntry(entry: LeaderboardEntry) {
    this.quizManagerService.blockPlayer(entry.contestantId).then(_ => console.log("Blocked player"))
  }

  clearLeaderboard() {
    this.quizManagerService.clearBoard().then(_ => console.log("Cleared leaderboard"))
  }
}
