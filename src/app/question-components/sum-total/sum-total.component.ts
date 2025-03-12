import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
  MatCardTitleGroup
} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {Question} from "../../model/question";
import {MatRadioButton} from "@angular/material/radio";
import {FormsModule} from "@angular/forms";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-sum-total',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    NgForOf,
    NgIf,
    MatCardTitle,
    MatCardTitleGroup,
    MatRadioButton,
    FormsModule,
    MatSlideToggle
  ],
  templateUrl: './sum-total.component.html',
  styleUrl: './sum-total.component.css'
})
export class SumTotalComponent {
  @Input() question: Question | undefined;

  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();

  radio1: boolean = false;
  radio2: boolean = false;
  radio3: boolean = false;
  radio4: boolean = false;
  radio5: boolean = false;
  radio6: boolean = false;
  radio7: boolean = false;
  radio8: boolean = false;


  submit() {
    if (this.question) {
      let sum = this.getTotalSum();


      console.log('total sum ', sum);
      this.answerSubmitted.emit([sum.toString()]);
    }
  }


  getTotalSum(): number {
    let sum = 0;
    if (this.radio1) {
      sum += 34;
    }
    if (this.radio2) {
      sum += 22;
    }
    if (this.radio3) {
      sum += 55;
    }
    if (this.radio4) {
      sum += 89;
    }
    if (this.radio5) {
      sum += 46;
    }
    if (this.radio6) {
      sum += 88;
    }
    if (this.radio7) {
      sum += 29;
    }
    if (this.radio8) {
      sum += 5;
    }
    return sum;
  }

  getFirstValue(answerOptions: string[] | undefined) {
    if (answerOptions) {
      return answerOptions[0]
    }
    return '';
  }
}
