import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from "../../model/question";

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit {

  //Globals
  stagingType = 0;
  score = 0;
  lines = 0;
  level = 1;
  activeBlock = {
    type: -1,
    coords: [[{x: 0, y: 0}]]
  };
  pause = false;
  timeout = 1000;

  gameScreen = [];
  // previewScreen = []

  targetScore = 0;

//Entry Point
  @Input() question: Question | undefined;

  @Output() answerSubmitted: EventEmitter<string[]> = new EventEmitter<string[]>();

  ngOnInit() {
    this.main()
    this.targetScore = Number(this.question?.answerOptions[0] ?? 0);
  }

  main() {
    this.initializeGameScreen();
    this.runGameTimer();
  }

  runGameTimer() {
    setTimeout(() => {
      console.log('gameloop', this.timeout);
      this.gameLoop();
      this.runGameTimer()
    }, this.timeout);

    let speed = 250;
    for (let i = 1; i <= this.level; i++) {
      speed *= 0.9;
    }
    this.timeout = this.timeout > speed ? speed : this.timeout;
  }

  clearStagingScreen() {

  }

  setStagingScreen() {

  }

  renderPreviewScreen() {
  }

  gameLoop() {
    if (!this.pause) {
      if (this.stagingType === 0) {
        this.clearStagingScreen();
        this.stagingType = Math.floor(Math.random() * 7) + 1;
        console.log(this.stagingType);
        this.setStagingScreen();
        this.renderPreviewScreen();
      }

      if (this.activeBlock.type === -1) {
        this.scoreForCompleteRows();
        this.initiateNewGameBlock();
        this.stagingType = 0;
      }

      this.moveDown();
      this.renderScreen();

    }
  }

  handleArrowKeys(e: string) {
    if (!this.pause && this.activeBlock.type != -1) {
      switch (e) {
        case "ArrowLeft":
          this.moveSideways(-1);
          this.renderScreen();
          break;
        case "ArrowRight":
          this.moveSideways(1);
          this.renderScreen();
          break;
        case "ArrowUp":
          this.rotate();
          this.renderScreen();
          break;
        case "ArrowDown":
          this.moveDown();
          this.renderScreen();
          break;
      }
    }
  }

  getLevel() {
    let gameLevel = 1;
    if (this.lines > 10) {
      gameLevel = Math.round(this.lines / 10) + 1;
    }
    return gameLevel;
  }

  setScoreAndLevel() {
    // const scoreElement = document.querySelector('#score-field');
    // // @ts-ignore
    // scoreElement.innerHTML = String(this.score);
    // const linesElement = document.querySelector('#level-field');
    // // @ts-ignore
    // linesElement.innerHTML = String(this.level);
  }

  scoreForCompleteRows() {
    const gameScreenDiv = document.querySelector('.tetris-view');

    let scoreCount = 0;
    this.gameScreen.forEach((row, index) => {
      // @ts-ignore
      const complete = row.every(el => el.filled > 0);
      if (complete) {
        scoreCount++;
        const rowObject = this.getNewRow(10);
        // @ts-ignore
        const parent = row[0].div.parentNode;
        // @ts-ignore
        parent.parentNode.removeChild(row[0].div.parentElement);
        this.gameScreen.splice(index, 1);
        // @ts-ignore
        this.gameScreen.splice(0, 0, rowObject.blocks);
        // @ts-ignore
        gameScreenDiv.insertBefore(rowObject.rowDiv, gameScreenDiv.children[0]);
      }
    });

    if (scoreCount > 0) {
      this.level = this.getLevel()
      switch (scoreCount) {
        case 1:
          this.score += (this.level * 100);
          break;
        case 2:
          this.score += (this.level * 200);
          break
        case 3:
          this.score += (this.level * 500);
          break;
        case 4:
          this.score += (this.level * 800);
          break;
      }
      this.lines += scoreCount
      this.setScoreAndLevel();
      let answerOption = this.question?.answerOptions[0];

      if (answerOption) {
        const maxScore = Number.parseInt(answerOption);
        if (this.score >= maxScore) {
          this.answerSubmitted.emit([answerOption])
        }
      }

    }
  }

  renderScreen() {
    this.gameScreen.forEach(row => {
      // @ts-ignore
      row.forEach(block => {
        block.div.className = 'tetris-block filled-' + block.filled
      })
    })
  }

  initializeGameScreen() {
    const gameScreenDiv = document.querySelector('.tetris-view');
    Array.from(Array(20).keys()).forEach((val, index) => {
      const {rowDiv, blocks} = this.getNewRow(10);
      // @ts-ignore
      gameScreenDiv.appendChild(rowDiv);
      // @ts-ignore
      this.gameScreen.push(blocks);
    });

    // const previewScreenDiv = document.querySelector('.preview-box');
    // Array.from(Array(4).keys()).forEach((val, index) => {
    //   const {rowDiv, blocks} = this.getNewRow(4);
    //   // @ts-ignore
    //   previewScreenDiv.appendChild(rowDiv);
    //   // @ts-ignore
    //   this.previewScreen.push(blocks);
    // });
  }

  getNewRow(length: any) {
    const rowDiv = this.createDivWithClass('tetris-row');
    // @ts-ignore
    const blocks = [];
    Array.from(Array(length).keys()).forEach((block, index) => {
      const blockDiv = this.createDivWithClass('tetris-block');
      rowDiv.appendChild(blockDiv);
      blocks.push({filled: 0, div: blockDiv});
    });
    // @ts-ignore
    return {rowDiv, blocks};
  }

  createDivWithClass(className: any) {
    const rowDiv = document.createElement('div');
    rowDiv.className = className;
    return rowDiv;
  }

  moveSideways(horizontalStep: any) {
    const coords = this.activeBlock.coords;

    if (this.canMoveSideways(coords, horizontalStep) && this.activeBlockIsNotReset()) {
      coords.forEach(row => {
        row.forEach(block => {
          if (block.y >= 0) {
            if (this.blocksOnPos(block) <= 1) {
              // @ts-ignore
              this.gameScreen[block.y][block.x].filled = 0;
            }
            block.x += horizontalStep;
            // @ts-ignore
            this.gameScreen[block.y][block.x].filled = this.activeBlock.type;
          } else {
            block.x += horizontalStep;
          }
        })
      })
    }
  }

  canMoveSideways(coords: any, horizontalStep: any) {
    let canMove = true;
    rowLoop: for (let figureRow of coords) {
      for (let block of figureRow) {
        const newX = block.x + horizontalStep;
        if (newX > 9 || newX < 0) {
          canMove = false;
          break rowLoop;
        }
        if (block.y >= 0) {
          const gameScreenBlock = this.gameScreen[block.y][newX];
          // @ts-ignore
          const isOwn = this.anyMatch(compareBlock => compareBlock.x === newX
            && compareBlock.y === block.y);

          // @ts-ignore
          if (gameScreenBlock.filled > 0 && !isOwn) {
            canMove = false;
            break rowLoop;
          }
        }
      }
    }
    return canMove;
  }

  activeBlockIsNotReset() {
    return this.activeBlock.type !== -1;
  }

  anyMatch(booleanCallback: any) {
    return this.activeBlock.coords.some(row => row.some(block => booleanCallback(block)));
  }

  getRotateCoords(block: any, maxY: any, minX: any) {
    const xOld = block.x;
    const yOld = block.y;
    const yNew = xOld + (maxY - minX);
    const xNew = minX + (maxY - yOld);
    return {yNew, xNew};
  }

  rotate() {
    const maxY = Math.max(...this.activeBlock.coords.flatMap(row => row.map(block => block.y)));
    const minX = Math.min(...this.activeBlock.coords.flatMap(row => row.map(block => block.x)));
    if (this.canRotate(maxY, minX)) {
      this.activeBlock.coords.forEach(row => row.forEach(block => {
        const xOld = block.x;
        const yOld = block.y;

        const {yNew, xNew} = this.getRotateCoords(block, maxY, minX);

        if (yOld >= 0 && this.blocksOnPos(block) <= 1) {
          // @ts-ignore
          this.gameScreen[yOld][xOld].filled = 0;
        }
        if (yNew >= 0) {
          // @ts-ignore
          this.gameScreen[yNew][xNew].filled = this.activeBlock.type;
        }
        block.x = xNew;
        block.y = yNew;
      }));
    }
  }

  canRotate(maxY: any, minX: any) {
    let canTurn = true;
    this.activeBlock.coords.forEach(row => row.forEach(block => {
      if (canTurn) {
        const {yNew, xNew} = this.getRotateCoords(block, maxY, minX);
        if (minX >= 0 && yNew < this.gameScreen.length && xNew <= 9) {
          const blockElement = this.gameScreen[yNew][xNew];
          // @ts-ignore
          if (!this.anyMatch(gameBlock => gameBlock.x === xNew && gameBlock.y === yNew)) {
            // @ts-ignore
            canTurn = blockElement.filled !== 1
          }
        } else {
          canTurn = false;
        }
      }
    }))
    return canTurn;
  }

  initiateNewGameBlock() {
    this.activeBlock.type = this.stagingType;
    this.activeBlock.coords = this.getStartCoordsForType(this.stagingType)
  }

  resetActiveBlock() {
    this.activeBlock.type = -1;
  }

  blocksOnPos(position: any) {
    let count = 0;
    this.activeBlock.coords.some(row => row.some(block => {
      if (block.x === position.x && block.y === position.y)
        count++;
    }));
    return count;
  }

  restartGame() {
    this.resetActiveBlock();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.timeout = 1000;
    this.setScoreAndLevel();
    this.pause = false;
  }

  resetGame() {
    this.gameScreen.slice().forEach((row, index) => {

      setTimeout(() => {
        if (index === this.gameScreen.length - 1) {
          this.restartGame();
        }
        // @ts-ignore
        row.forEach(block => block.filled = 0);
        this.renderScreen();
      }, index * 100);
    })
  }

  loseGame() {
    this.pause = true;
    this.gameScreen.slice().reverse().forEach((row, index) => {

      setTimeout(() => {
        // @ts-ignore
        row.forEach(block => block.filled = 8);
        this.renderScreen();
        if (index === this.gameScreen.length - 1) {
          this.answerSubmitted.emit(["-1"])
          this.resetGame();
        }
      }, index * 100);
      console.log()
    })
  }

  moveDown() {
    let invalidMove = false;
    const figureRowCount = this.activeBlock.coords.length - 1;
    for (let i = figureRowCount; i >= 0; i--) {
      const figureRow = this.activeBlock.coords[i];

      figureRow.forEach((position, index) => {
        const newY = position.y + 1;
        if (newY >= 0 && !invalidMove) {
          invalidMove = newY >= this.gameScreen.length;

          if (!invalidMove) {
            // @ts-ignore
            const isSelf = this.anyMatch(block => block.x === position.x
              && block.y === newY);
            if (i === figureRowCount) {
              if (!isSelf) {
                // @ts-ignore
                invalidMove = this.gameScreen[newY][position.x].filled > 0;
              }
            } else {
              const blockBelow = this.activeBlock.coords[i + 1]
                .some(blockCoordinates => blockCoordinates.x === position.x
                  && blockCoordinates.y === newY);
              if (!blockBelow) {
                if (!isSelf) {
                  // @ts-ignore
                  invalidMove = this.gameScreen[newY][position.x].filled > 0;
                }
              }
            }
          }
          if (invalidMove) {
            this.resetActiveBlock();
          }
        }
      });
    }

    if (!invalidMove) {
      for (let i = figureRowCount; i >= 0; i--) {
        const figureRow = this.activeBlock.coords[i];
        figureRow.forEach((position, index) => {
          const newY = position.y + 1;

          if (position.y >= 0 && this.blocksOnPos(position) <= 1) {
            // @ts-ignore
            this.gameScreen[position.y][position.x].filled = 0
          }
          if (newY >= 0) {
            // @ts-ignore
            this.gameScreen[newY][position.x].filled = this.activeBlock.type;
          }
          position.y = newY;
        });
      }
    } else {
      const lost = this.activeBlock.coords.flatMap(row => row.map(block => block.y)).every(yCoord => yCoord < 0);
      if (lost) {
        this.loseGame();
      }

    }
  }

  getStartCoordsForType(stagingTypeId: any) {
    // @ts-ignore
    let returnValue = [];
    switch (stagingTypeId) {
      case 1:
        // #
        // #
        // #
        // #
        returnValue = [[{x: 5, y: -4}], [{x: 5, y: -3}], [{x: 5, y: -2}], [{x: 5, y: -1}]];
        break
      case 2:
        // #
        // #
        // ##
        returnValue = [[{x: 5, y: -3}], [{x: 5, y: -2}], [{x: 5, y: -1}, {x: 6, y: -1}]];
        break;
      case 3:
        //  #
        //  #
        // ##
        returnValue = [[{x: 5, y: -3}], [{x: 5, y: -2}], [{x: 4, y: -1}, {x: 5, y: -1}]]
        break;
      case 4:
        // ##
        // ##
        returnValue = [[{x: 5, y: -2}, {x: 6, y: -2}], [{x: 5, y: -1}, {x: 6, y: -1}]]
        break;
      case 5:
        // ##
        //  ##
        returnValue = [[{x: 5, y: -2}, {x: 6, y: -2}], [{x: 6, y: -1}, {x: 7, y: -1}]]
        break;
      case 6:
        //  ##
        // ##
        returnValue = [[{x: 6, y: -2}, {x: 7, y: -2}], [{x: 5, y: -1}, {x: 6, y: -1}]]
        break;
      case 7:
        // #
        // ##
        // #
        returnValue = [[{x: 5, y: -3}], [{x: 5, y: -2}, {x: 6, y: -2}], [{x: 5, y: -1}]];
        break;
    }
    // @ts-ignore
    return returnValue;
  }


}
