import {Injectable} from "@angular/core";
import {LeaderboardEntry} from "../../model/leaderboard-entry";
import {Observable, Subject} from "rxjs";
import {LeaderboardDataService} from "./leaderboard-data.service";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardStateService {

  constructor(private leaderboardDataService: LeaderboardDataService) {
  }

  private subject: Subject<LeaderboardEntry[]> = new Subject<LeaderboardEntry[]>();

  public updateSubject() {
    this.leaderboardDataService.getLeaderboardData().then((leaderboardEntries) => this.subject.next(leaderboardEntries));
  }

  public getState(): Observable<LeaderboardEntry[]> {
    return this.subject.asObservable();
  }
}
