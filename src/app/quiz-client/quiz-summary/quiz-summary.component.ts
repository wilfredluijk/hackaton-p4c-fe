import {Component, Input} from '@angular/core';
import {QuizSummary} from "../../model/quiz-summary";

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.css']
})
export class QuizSummaryComponent {
  @Input() summary: QuizSummary | undefined;
}
