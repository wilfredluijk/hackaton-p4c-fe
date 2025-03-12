import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Question} from "../model/question";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsUrl = 'assets/questions.json';

  constructor(private http: HttpClient) {}

  getQuestions(): Promise<Question[]> {
    return firstValueFrom(this.http.get<Question[]>(this.questionsUrl));
  }
}
