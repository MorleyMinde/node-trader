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

export interface TradeObservation {
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
export enum Direction {
  WAIT = 0,
  BUY = 1,
  SELL = 2,
  CLOSE = 3,
}
export interface Action {
  instrument: string;
  units: number;
  side: Direction;
}
