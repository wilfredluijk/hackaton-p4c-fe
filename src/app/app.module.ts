import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {USE_EMULATOR} from "@angular/fire/compat/functions";
import {RxStompService} from "./stomp/rx-stomp.service";
import {rxClientStompServiceFactory, rxStompServiceFactory} from "./stomp/rx-stomp-factory.service";
import {RxClientStompService} from "./stomp/rx-client-stomp.service";
import {QuizManagerComponent} from './quiz-manager/quiz-manager.component';
import {QuizClientComponent} from './quiz-client/quiz-client.component';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {MovingButtonClickComponent} from './question-components/moving-button-click/moving-button-click.component';
import {SingleAnswerComponent} from './question-components/single-answer/single-answer.component';
import {
  SortingQuestionViewComponent
} from "./question-components/sorting-question-view/sorting-question-view.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ObjectRecognitionComponent} from './question-components/object-recognition/object-recognition.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {QuizSummaryComponent} from './quiz-client/quiz-summary/quiz-summary.component';
import {LeaderboardComponent} from './quiz-manager/leaderboard/leaderboard.component';
import {TetrisComponent} from './question-components/tetris/tetris.component';
import {NgOptimizedImage} from "@angular/common";
import {AngularFireModule} from "@angular/fire/compat";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {SliderSelectComponent} from "./question-components/slider-select/slider-select.component";
import {MatSliderModule} from "@angular/material/slider";
import {ProgressBarComponent} from './quiz-client/progress-bar/progress-bar.component';
import {CodeViewComponent} from './question-components/code-view/code-view.component';
import {HIGHLIGHT_OPTIONS, HighlightModule} from "ngx-highlightjs";
import {SumTotalComponent} from "./question-components/sum-total/sum-total.component";


const appRoutes: Routes = [
  {path: '', component: QuizClientComponent},
  {path: 'console', component: QuizManagerComponent,}
];


@NgModule({
  declarations: [
    AppComponent,
    SortingQuestionViewComponent,
    QuizManagerComponent,
    QuizClientComponent,
    MovingButtonClickComponent,
    SingleAnswerComponent,
    ObjectRecognitionComponent,
    QuizSummaryComponent,
    LeaderboardComponent,
    TetrisComponent,
    SliderSelectComponent,
    ProgressBarComponent,
    CodeViewComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    RouterModule.forRoot(appRoutes),
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    NgOptimizedImage,
    MatSnackBarModule,
    MatSliderModule, HighlightModule, SumTotalComponent
  ], providers: [
    {provide: USE_EMULATOR, useValue: ['localhost', 5001]}, {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    }, {
      provide: RxClientStompService,
      useFactory: rxClientStompServiceFactory,
    },
    provideHttpClient(withInterceptorsFromDi())
    , {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          java: () => import('highlight.js/lib/languages/java.js'),
          // Add more languages here
        }
      }
    }
  ]
})
export class AppModule {
}
