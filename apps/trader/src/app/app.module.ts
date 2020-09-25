import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {SocketService} from './services/socket.service';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    ChartModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
