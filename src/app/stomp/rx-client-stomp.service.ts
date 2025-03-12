import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable()
export class RxClientStompService extends RxStomp {
  constructor() {
    super();
  }
}
