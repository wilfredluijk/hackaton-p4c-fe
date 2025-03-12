import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../model/question";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.component.html',
  styleUrls: ['./code-view.component.css']
})
export class CodeViewComponent {
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
