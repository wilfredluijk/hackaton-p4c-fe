import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({providedIn: "root"})
export class QuizManagerService {


  constructor(private http: HttpClient) {
  }

  blockPlayer(id: number): Promise<void> {
    return firstValueFrom(this.http.get<void>(environment.url + "/api/quizmanager/blockplayer/" + id));
  }

  clearBoard(): Promise<void> {
    return firstValueFrom(this.http.get<void>(environment.url + "/api/quizmanager/clearBoard"));
  }
}
