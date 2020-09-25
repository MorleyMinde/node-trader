import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@my/api-interfaces';
import { SocketService } from './services/socket.service';
import { StockChart } from 'angular-highcharts';
import { map, filter } from 'rxjs/operators';
import {
  batchCandleArray,
  batchCandleJSON,
  batchTicksToCandle,
  ticksToTickChart,
} from 'candlestick-convert';

@Component({
  selector: 'my-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient, private socketService: SocketService) {}

  chart = new StockChart({
    rangeSelector: {
      selected: 1,
    },

    title: {
      text: 'AAPL Stock Price',
    },

    series: [
      {
        type: 'candlestick',
        name: 'AAPL Stock Price',
        data: [],
        dataGrouping: {
          units: [
            [
              'week', // unit name
              [1], // allowed multiples
            ],
            ['month', [1, 2, 3, 4, 6]],
          ],
        },
      },
    ],
  });
  ngOnInit() {
    let tradeData = [];
    this.socketService
      .setupSocketConnection()
      .pipe(
        map((d) => {
          console.log('d.observation:', d.observation);
          tradeData.push({
            price: parseFloat(d.observation.bids[0].price),
            quantity: d.observation.bids[0].liquidity,
            time: new Date(d.observation.time).getTime(),
          });
          tradeData.push({
            price: parseFloat(d.observation.asks[0].price),
            quantity: d.observation.asks[0].liquidity,
            time: new Date(d.observation.time).getTime(),
          });
          //console.log('tradeData:', tradeData);

          //console.log('batchTicksToCandle(tradeData, 3):', ticksToTickChart(tradeData, 2));
          console.log('Steam:', ticksToTickChart(tradeData, 2));
          let candles = ticksToTickChart(tradeData, 2);
          return candles.map((candle) => [
            candle.time,
            candle.open,
            candle.high,
            candle.low,
            candle.close,
          ]);
        }),
      )
      .subscribe((data) => {
        console.log('Steam1:', data);

        this.chart.ref$.subscribe((c)=>{
          /*data.forEach((d)=>{
            c.series[0].addPoint(d);
          })*/
          console.log('Data:', c.series[0].data);
        })
        this.chart = new StockChart({
          rangeSelector: {
            selected: 1,
          },

          title: {
            text: 'AAPL Stock Price',
          },

          series: [
            {
              type: 'candlestick',
              name: 'AAPL Stock Price',
              data: data,
              dataGrouping: {
                units: [
                  [
                    'week', // unit name
                    [1], // allowed multiples
                  ],
                  ['month', [1, 2, 3, 4, 6]],
                ],
              },
            },
          ],
        });
      });
  }
}
