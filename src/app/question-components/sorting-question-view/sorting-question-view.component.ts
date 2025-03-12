import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Question} from "../../model/question";

@Component({
  selector: 'app-sorting-question-view',
  templateUrl: './sorting-question-view.component.html',
  styleUrls: ['./sorting-question-view.component.css']
})
export class SortingQuestionViewComponent {
  @Input() question: Question | undefined;

  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();

  submit() {
    if (this.question) {
      this.answerSubmitted.emit(this.question.answerOptions);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.question) {
      moveItemInArray(this.question.answerOptions, event.previousIndex, event.currentIndex);
    }
  }
}
