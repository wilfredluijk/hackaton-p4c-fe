import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {LeaderboardEntry} from "../../model/leaderboard-entry";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class LeaderboardDataService {

  constructor(private http: HttpClient){
  }

  public getLeaderboardData(): Promise<LeaderboardEntry[]> {
    return firstValueFrom(this.http.get<LeaderboardEntry[]>(environment.url + "/api/leaderboard"));
  }
}
