import * as fx from 'simple-fxtrade';
import {  Action, Granularity, Direction, OAndaMarketState, MarketTickState } from '../interfaces/trading.interface';


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export class OAndaTrader implements IGym<OAndaMarketState, Action> {
  actionSpace: ActionSpace;

  //private _data: Promise<StepResult<TradeObservation>>;
  private _data: MarketTickState;
  //private _previousData: MarketTickState;
  private _previousState: OAndaMarketState;
  private _currentOrder: any;
  private _currentAction: Action;
  constructor(private granularity:Granularity) {
    fx.configure({
      apiKey:
        '32952207879e2abea06399919554fb0b-e7474399c01d55c098ecfdfda907bd9e',
    });
  }
  render(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async reset(): Promise<OAndaMarketState> {
    await this.initiate();
    await this.removeAllTrades();
    return this.getEntireState();
  }
  sameAsPreviousAction(action: Action) {
    if (!this._currentAction || !action) {
      return false;
    }
    return this._currentAction.side == action.side;
  }

  async step(action: Action): Promise<StepResult<OAndaMarketState>> {
    let currentData = await this._data;
    if (this._previousState) {
      let currentTime = new Date(currentData.time).getTime();
      let previousTime = new Date(
        this._previousState.market.time
      ).getTime();
      while (currentTime - previousTime < this.granularity) {
        await sleep(500);
        currentData = await this._data;
        currentTime = new Date(currentData.time).getTime();
      }
    }
    if (!this._currentOrder) {
      await this.removeAllTrades();
    }
    if (!this.sameAsPreviousAction(action)) {
      if (action.side == Direction.BUY) {
        this._currentOrder = {
          units: action.units,
          instrument: action.instrument,
          timeInForce: 'FOK',
          type: 'MARKET',
          positionFill: 'DEFAULT',
        };
        await fx.orders.create({
          order: this._currentOrder,
        });
      } else if (action.side == Direction.SELL) {
        this._currentOrder = {
          units: 0 - action.units,
          instrument: action.instrument,
          timeInForce: 'FOK',
          type: 'MARKET',
          positionFill: 'DEFAULT',
        };
        await fx.orders.create({
          order: this._currentOrder,
        });
      } else if (action.side == Direction.CLOSE) {
        this.removeAllTrades();
      }
    }
    this._currentAction = action;
    let currentState = await this.getEntireState();
    let step = {
      state:currentState,
      reward: this.calculateReward(currentState, this._previousState),
      done: !currentState.market.tradeable,
      info: 'Awesome'
    }
    this._previousState = currentState;
    return step;
  }
  calculateReward(currentSate:OAndaMarketState, previousState:OAndaMarketState):number{
    if(!previousState){
      return 0;
    }
    return parseFloat(currentSate.account.withdrawalLimit) - parseFloat(previousState.account.withdrawalLimit);
  }
  async removeAllTrades() {
    const { trades } = await fx.trades({ count: 10, instrument: 'EUR_USD' });
    for (let trade of trades) {
      await fx.trades.close({ id: trade.id });
    }
  }
  async initiate(){
    const {
      accounts: [{ id }],
    } = await fx.accounts();
    fx.setAccount(id);
    const stream = await fx.pricing.stream({ instruments: 'EUR_USD' });

    // Handle some data
    stream.on('data', (data:MarketTickState) => {
      if (data.type == 'PRICE') {
        this._data = data;
      }
    });
  }
  async getEntireState():Promise<OAndaMarketState>{
    const { account } = await fx.summary();
    return {
      market: this._data,
      account
    };
  }
}
