import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from "../../model/question";

@Component({
  selector: 'app-slider-select',
  templateUrl: './slider-select.component.html',
  styleUrls: ['./slider-select.component.css']
})
export class SliderSelectComponent implements OnInit {
  @Input() question!: Question | undefined;
  @Output() answerSubmitted = new EventEmitter<string[]>();
  answer: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  submit() {
    if (this.question && this.answer) {
      this.answerSubmitted.emit([this.answer.toString()]);
    }
  }

  formatLabel(value: number): string {
    const s = value.toString(16);
    console.log(s)
    return s
  }

  toHex(value: number): string {
    const s = value.toString()
    const s1 = s + 1;
    const s2 = s1.substring(0, s1.length - 1);
    return Number(s2).toString(16)
  }

  getFirstValue(answerOptions: string[] | undefined) {
    if (answerOptions) {
      return answerOptions[0]
    }
    return '';
  }
}
