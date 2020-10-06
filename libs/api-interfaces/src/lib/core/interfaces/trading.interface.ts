import { IAction } from './agent.interface';

export enum Granularity {
  S1 = 1000,
  S5 = 5 * Granularity.S1,
  S15 = 5 * Granularity.S1,
  M1 = 60 * Granularity.S1,
}
export interface Bid {
  price: string;
  liquidity: number;
}

export interface Ask {
  price: string;
  liquidity: number;
}

export interface Mid {
  o: string;
  h: string;
  l: string;
  c: string;
}

export interface ICandle {
  complete: boolean;
  volume: number;
  time: string;
  mid: Mid;
}
export class Candle implements ICandle{
  complete: boolean;
  volume: number;
  time: string;
  mid: Mid;
  constructor(candle:ICandle){
    this.complete=candle.complete;
    this.volume=candle.volume;
    this.time=candle.time;
    this.mid=candle.mid;
  };
  equals(otherCandle:ICandle){
    return otherCandle.complete == this.complete && 
    otherCandle.volume == this.volume &&
    //otherCandle.time == this.time && 
    otherCandle.mid.c == this.mid.c && 
    otherCandle.mid.h == this.mid.h && 
    otherCandle.mid.l == this.mid.l &&
    otherCandle.mid.o == this.mid.o  
  }
}
export interface MarketTickState {
  type: string;
  time: string;
  bids: Bid[];
  asks: Ask[];
  closeoutBid: string;
  closeoutAsk: string;
  status: string;
  tradeable: boolean;
  instrument: string;
}
export interface OAndaAccountState {
  hedgingEnabled: boolean,
  marginRate: string,
  balance: string,
  openTradeCount: number,
  openPositionCount: number,
  pendingOrderCount: number,
  pl:string,
  financing:string,
  commission: string,
  dividendAdjustment: string,
  guaranteedExecutionFees:string,
  unrealizedPL:string,
  NAV:string,
  marginUsed:string,
  marginAvailable:string,
  positionValue:string,
  marginCloseoutUnrealizedPL:string,
  marginCloseoutNAV:string,
  marginCloseoutMarginUsed:string,
  marginCloseoutPositionValue:string,
  marginCloseoutPercent:string,
  withdrawalLimit:string,
  marginCallMarginUsed:string,
  marginCallPercent:string
}

export interface PositionType {
  units: string;
  averagePrice: string;
  pl: string;
  resettablePL: string;
  financing: string;
  dividendAdjustment: string;
  guaranteedExecutionFees: string;
  tradeIDs: string[];
  unrealizedPL: string;
}

export interface Position {
  instrument: string;
  long: PositionType;
  short: PositionType;
  pl: string;
  resettablePL: string;
  financing: string;
  commission: string;
  dividendAdjustment: string;
  guaranteedExecutionFees: string;
  unrealizedPL: string;
  marginUsed: string;
}
export interface OAndaMarketState {
  instrument:string,
  market:Candle[],
  account:OAndaAccountState,
  positions:Position[]
}
export enum Direction {
  WAIT = 0,
  BUY = 1,
  SELL = 2,
  CBUY = 3,
  CSELL = 4,
  CLOSE = 5,
}
export class OandaAction implements IAction{
  constructor(public units:number, public side:Direction){};
  getIndex(): number {
    return this.side;
  }
}
