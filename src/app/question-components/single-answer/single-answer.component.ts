import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../model/question";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-single-answer',
  templateUrl: './single-answer.component.html',
  styleUrls: ['./single-answer.component.css']
})
export class SingleAnswerComponent {
  @Input() question: Question | undefined;

  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();
  private selectedAnswer: string | undefined;

  submit() {
    if (this.question && this.selectedAnswer) {
      this.answerSubmitted.emit([this.selectedAnswer]);
    }
  }

  selectionChanged($event: MatButtonToggleChange) {
    this.selectedAnswer = $event.value;
  }
}
