import {
    ticksToTickChart,
  } from 'candlestick-convert';
import { MarketTickState } from '../interfaces/trading.interface';

export const convertObservationToCandleArray = (tickData: MarketTickState):Array<number>=>{

    let tradeData = [];
    try{
      tradeData.push({
        price: parseFloat(tickData.bids[0].price),
        quantity: tickData.bids[0].liquidity,
        time: new Date(tickData.time).getTime(),
      });
      tradeData.push({
        price: parseFloat(tickData.asks[0].price),
        quantity: tickData.asks[0].liquidity,
        time: new Date(tickData.time).getTime(),
      });
    }catch(e){
      throw e;
    }
    let candles = ticksToTickChart(tradeData, 2);
    return candles.map((candle) => [
        //candle.time,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        //candle.volume,
      ])[0];
}