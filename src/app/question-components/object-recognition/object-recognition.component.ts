import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
//import COCO-SSD model as cocoSSD
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import {Question} from "../../model/question";
import {DetectedObject} from "@tensorflow-models/coco-ssd";

@Component({
  selector: 'app-object-recognition',
  templateUrl: './object-recognition.component.html',
  styleUrls: ['./object-recognition.component.css']
})
export class ObjectRecognitionComponent implements OnInit {
  title = 'TF-ObjectDetection';
  // @ts-ignore
  private video: HTMLVideoElement;

  @Input() question: Question | undefined;

  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();
  recognizedCount: number = 0;


  ngOnInit() {
    this.webcam_init();
    this.predictWithCocoModel();
  }

  public async predictWithCocoModel() {
    const model = await cocoSSD.load('lite_mobilenet_v2');
    this.detectFrame(this.video, model);
    console.log('model loaded');
  }

  webcam_init() {
    this.video = <HTMLVideoElement>document.getElementById("vid");

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        }
      })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
        };
      });
  }

  // @ts-ignore
  detectFrame = (video, model) => {
    // @ts-ignore
    model.detect(video).then(predictions => {

      predictions.forEach((prediction: any) => this.handlePrediction(prediction));
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  // @ts-ignore
  renderPredictions = predictions => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    if(!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 300;

    // @ts-ignore
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    // @ts-ignore

    ctx.font = font;
    // @ts-ignore

    ctx.textBaseline = "top";    // @ts-ignore

    ctx.drawImage(this.video, 0, 0, 300, 300);
    // @ts-ignore

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      // @ts-ignore

      ctx.strokeStyle = "#00FFFF";
      // @ts-ignore

      ctx.lineWidth = 2;
      // @ts-ignore

      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      // @ts-ignore

      ctx.fillStyle = "#00FFFF";
      // @ts-ignore

      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      // @ts-ignore

      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
    // @ts-ignore

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      // @ts-ignore

      ctx.fillStyle = "#000000";
      // @ts-ignore

      ctx.fillText(prediction.class, x, y);
    });
  };



  private handlePrediction(prediction: DetectedObject) {
    if (this.question) {
      const answerOptions: string[] = this.question.answerOptions;
      if (answerOptions.map(answerOption => answerOption.toLowerCase()).includes(prediction.class.toLowerCase())) {
          this.recognizedCount++
          if(this.recognizedCount > 100) {
            this.answerSubmitted.emit(this.question.answerOptions);
          }
      }
    }
  }
}
