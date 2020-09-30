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
  market:MarketTickState,
  account:OAndaAccountState,
  positions:Position[]
}
export enum Direction {
  WAIT = 0,
  BUY = 1,
  SELL = 2,
  CLOSE = 3,
}
export class OandaAction implements IAction{
  constructor(public instrument:string,public units:number, public side:Direction){};
  getIndex(): number {
    return this.side;
  }
}
