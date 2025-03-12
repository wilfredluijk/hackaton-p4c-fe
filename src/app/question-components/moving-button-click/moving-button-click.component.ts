import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { Question } from "../../model/question";

@Component({
  selector: 'app-moving-button-click',
  templateUrl: './moving-button-click.component.html',
  styleUrls: ['./moving-button-click.component.css']
})
export class MovingButtonClickComponent implements OnInit, OnDestroy {

  @ViewChild('container', { static: true }) container: ElementRef | undefined;
  @ViewChild('button', { read: ElementRef }) button: ElementRef | undefined;

  count: number = 0;

  @Input() question: Question | undefined;
  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();

  intervalId: any; // Store interval ID for clearing later

  ngOnInit(): void {
    this.startMovingButton(); // Start the movement when component is initialized
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear the interval when the component is destroyed
  }

  startMovingButton() {
    this.intervalId = setInterval(() => {
      this.change();
    }, 700); // Change position every 1 second (1000 ms)
  }

  changePos() {
    this.count++;

    if (this.question) {
      const maxCount: number = Number(this.question.answerOptions[0]);

      console.log('click count', this.count);
      if (this.count >= maxCount) {
        clearInterval(this.intervalId); // Stop moving the button when answer is submitted
        this.answerSubmitted.emit(this.question.answerOptions);
      }
    }
  }

  change() {
    const buttonElement = this.button?.nativeElement;
    const containerElement = this.container?.nativeElement;

    if (buttonElement && containerElement) {
      // Get container and button dimensions
      const containerRect = containerElement.getBoundingClientRect();
      const buttonRect = buttonElement.getBoundingClientRect();

      // Calculate new position ensuring the button stays within the container
      const newX = Math.floor(Math.random() * (containerRect.width - buttonRect.width));
      const newY = Math.floor(Math.random() * (containerRect.height - buttonRect.height));

      // Apply the new position
      buttonElement.style.position = 'absolute';
      buttonElement.style.left = `${newX}px`;
      buttonElement.style.top = `${newY}px`;
    }
  }
}

