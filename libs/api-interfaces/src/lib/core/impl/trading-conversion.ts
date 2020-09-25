import {
    ticksToTickChart,
  } from 'candlestick-convert';
import { TradeObservation } from '../interfaces/trading.interface';

export const convertObservationToCandleArray = (observation: TradeObservation):Array<number>=>{

    let tradeData = [];
    try{
      tradeData.push({
        price: parseFloat(observation.bids[0].price),
        quantity: observation.bids[0].liquidity,
        time: new Date(observation.time).getTime(),
      });
      tradeData.push({
        price: parseFloat(observation.asks[0].price),
        quantity: observation.asks[0].liquidity,
        time: new Date(observation.time).getTime(),
      });
    }catch(e){
      console.log('observation:',observation);
      throw e;
    }
    let candles = ticksToTickChart(tradeData, 2);
    return candles.map((candle) => [
        candle.time,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
      ])[0];
}