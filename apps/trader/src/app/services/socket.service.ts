import { Injectable } from '@angular/core'
import * as io from 'socket.io-client';
import { Observable} from 'rxjs';

@Injectable()
export class SocketService {
  socket;
  _data:Observable<any>;
  constructor() {}
  setupSocketConnection(): Observable<any> {
    this.socket = io('http://localhost:3333');
    //this.socket.emit('events', 'Hello there from Angular.');
    return new Observable<any>((observer)=>{
      this.socket.on('step', (msg) => {
        //console.log(msg);
        observer.next(msg);
      });
    })
  }
}
