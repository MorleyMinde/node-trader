import * as fx from 'simple-fxtrade';
import {
  Granularity,
  Direction,
  OAndaMarketState,
  MarketTickState,
  OandaAction,
  Candle,
} from '../interfaces/trading.interface';
import { calculateReward } from '../utils/reward.util';
import { IGym, StepResult, ActionSpace } from '../interfaces/gym.interface';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export class OAndaTrader implements IGym<OAndaMarketState, OandaAction> {
  actionSpace: ActionSpace;

  //private _data: Promise<StepResult<TradeObservation>>;
  private _data: MarketTickState;
  //private _previousData: MarketTickState;
  private _previousState: OAndaMarketState;
  private _currentOrder: any;
  private _currentAction: OandaAction;
  constructor(private instrument: string, private granularity: Granularity) {
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
  sameAsPreviousAction(action: OandaAction) {
    if (!this._currentAction || !action) {
      return false;
    }
    return this._currentAction.side == action.side;
  }

  async onMarketChange(callback: (state: OAndaMarketState) => void) {

    const {
      accounts: [{ id }],
    } = await fx.accounts();
    fx.setAccount(id);
    /*await fx.orders.create({
      order: {
        units: -5,
        instrument: 'AUD_USD',
        type: 'MARKET',
        positionFill: 'DEFAULT'
      }
    });
    return;*/
    let previousCandles: Array<Candle>;

    setInterval(async () => {
      const candleResults = await fx.candles({
        id: this.instrument,
        count: 60,
      });
      let candles: Candle[] = candleResults.candles.map((candle)=>new Candle(candle));
      let registerMarketChange = async() => {
        const { positions } = await fx.positions();
        const { account } = await fx.summary();
        callback({
          instrument:this.instrument,
          market: candles,
          account: account,
          positions: positions,
        });
        previousCandles = candles
      };
      if (previousCandles) {
        if (!candles.every((candle, index) => candle.equals(previousCandles[index]))
        ) {
          registerMarketChange();
        }
      } else {
        registerMarketChange();
      }
    }, 5000);
  }
  async act(action: OandaAction){
    try{
      if(action.side == Direction.BUY){
        if(action.units > 0){
          //console.log(`Buying: ${action.units}`);
          await fx.orders.create({
            order: {
              units: Math.floor(action.units),
              instrument: this.instrument,
              timeInForce: 'FOK',
              type: 'MARKET',
              positionFill: 'DEFAULT',
            },
          });
        }
      }else if(action.side == Direction.SELL){
        if(action.units > 0){
          //console.log(`Selling: ${action.units}`);
          await fx.orders.create({
            order: {
              units: Math.floor(-action.units),
              instrument: this.instrument,
              timeInForce: 'FOK',
              type: 'MARKET',
              positionFill: 'DEFAULT',
            },
          });
        }
      }else if(action.side == Direction.CBUY){
        //console.log('Closing Buy Position');
        await fx.positions.close({ 
          id:this.instrument,
          longUnits : 'ALL',
        });
      }else if(action.side == Direction.CSELL){
        //console.log('Closing Sell Position');
        await fx.positions.close({ 
          id:this.instrument,
          shortUnits : 'ALL',
        });
      }else if(action.side == Direction.CLOSE){
        //console.log('Closing Sell Position');
        await this.removeAllPositions();
      }
    }catch(e){
      if(e.errorCode && e.errorCode == 'CLOSEOUT_POSITION_DOESNT_EXIST'){
        console.log(e.errorCode);
      }else{
        console.error(e);
      }
      //console.error(e);
    }
  }
  async step(action: OandaAction): Promise<StepResult<OAndaMarketState>> {
    let currentData = await this._data;
    if (this._previousState) {
      let currentTime = new Date(currentData.time).getTime();
      /*let previousTime = new Date(this._previousState.market.time).getTime();
      while (currentTime - previousTime < this.granularity) {
        await sleep(500);
        currentData = await this._data;
        currentTime = new Date(currentData.time).getTime();
      }*/
    }
    if (!this._currentOrder) {
      await this.removeAllTrades();
    }
    if (!this.sameAsPreviousAction(action)) {
      if (action.side == Direction.BUY) {
        this._currentOrder = {
          units: action.units,
          instrument: this.instrument,
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
          instrument: this.instrument,
          timeInForce: 'FOK',
          type: 'MARKET',
          positionFill: 'DEFAULT',
        };
        await fx.orders.create({
          order: this._currentOrder,
        });
      }/* else if (action.side == Direction.CLOSE) {
        this.removeAllTrades();
      }*/
    }
    this._currentAction = action;
    let currentState = await this.getEntireState();
    let step = {
      state: currentState,
      reward: this.calculateReward(currentState, this._previousState),
      done: false,
      info: 'Awesome',
    };
    this._previousState = currentState;
    return step;
  }
  calculateReward(
    currentSate: OAndaMarketState,
    nextState: OAndaMarketState
  ): number {
    if (!nextState) {
      return 0;
    }
    return calculateReward(currentSate, nextState);
  }
  async removeAllTrades() {
    const { trades } = await fx.trades({
      count: 10,
      instrument: this.instrument,
    });
    for (let trade of trades) {
      await fx.trades.close({ id: trade.id });
    }
  }
  async removeAllPositions() {
    const {positions} = await fx.positions();
    for (let position of positions.filter((position)=>position.instrument == this.instrument)) {
      console.log(position);
      await fx.positions.close({ id:this.instrument });
    }
  }
  async initiate() {
    const {
      accounts: [{ id }],
    } = await fx.accounts();
    fx.setAccount(id);
    const stream = await fx.pricing.stream({ instruments: this.instrument });

    const { candles, instrument } = await fx.candles({
      id: this.instrument,
      count: 5,
    });

    setInterval(async () => {
      const { candles, instrument } = await fx.candles({
        id: this.instrument,
        count: 5,
      });
      console.log('candles Length:', JSON.stringify(candles));
    }, 1000);
    // Handle some data
    /*stream.on('data', (data:MarketTickState) => {
      if (data.type == 'PRICE') {
        this._data = data;
      }
    });*/
  }
  async getEntireState(): Promise<OAndaMarketState> {
    const { account } = await fx.summary();
    const { positions } = await fx.positions();
    /*return {
      market: undefined,//this._data,
      account,
      positions,
    };*/
    return null;
  }
}
