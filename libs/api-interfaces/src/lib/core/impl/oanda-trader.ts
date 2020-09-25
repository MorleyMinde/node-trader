import * as fx from 'simple-fxtrade';
import { TradeObservation, Action, Granularity, Direction } from '../interfaces/trading.interface';
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export class OAndaTrader implements IGym<TradeObservation, Action> {
  actionSpace: ActionSpace;

  //private _data: Promise<StepResult<TradeObservation>>;
  private _data: StepResult<TradeObservation>;
  private _previousData: StepResult<TradeObservation>;
  private _currentOrder: any;
  private _currentAction: Action;
  constructor(private granularity:Granularity) {
    fx.configure({
      apiKey:
        '32952207879e2abea06399919554fb0b-e7474399c01d55c098ecfdfda907bd9e',
    });
  }
  async state(): Promise<TradeObservation> {
    return (await this._data).observation;
  }
  render(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async reset(): Promise<TradeObservation> {
    await this.initiate();
    await this.removeAllTrades();
    return (await this._data).observation;
  }
  sameAsPreviousAction(action: Action) {
    if (!this._currentAction || !action) {
      return false;
    }
    return this._currentAction.side == action.side;
  }

  async step(action: Action): Promise<StepResult<TradeObservation>> {
    let currentData = await this._data;
    if (this._previousData) {
      let currentTime = new Date(currentData.observation.time).getTime();
      let previousTime = new Date(
        this._previousData.observation.time
      ).getTime();
      while (currentTime - previousTime < this.granularity) {
        await sleep(500);
        currentData = await this._data;
        currentTime = new Date(currentData.observation.time).getTime();
      }
    }
    this._previousData = currentData;
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
    const { account } = await fx.summary();
    //console.table(account);
    this._currentAction = action;
    return this._data;
  }
  async removeAllTrades() {
    const { trades } = await fx.trades({ count: 10, instrument: 'EUR_USD' });
    for (let trade of trades) {
      await fx.trades.close({ id: trade.id });
    }
  }
  async initiate(): Promise<StepResult<TradeObservation>> {
    const {
      accounts: [{ id }],
    } = await fx.accounts();
    fx.setAccount(id);
    const stream = await fx.pricing.stream({ instruments: 'EUR_USD' });

    // Handle some data
    stream.on('data', (data) => {

      if (data.type == 'PRICE') {
        this._data = {
          observation: data,
          reward: 0,
          done: false,
          info: 'Normal',
        };
      }
    });
    /*this._data = new Promise<StepResult<TradeObservation>>((resolve) => {
      stream.on('data', (data) => {
        let results:StepResult<TradeObservation> = {
            observation: data,
            reward: 0,
            done: false,
            info: 'Normal'
        }
        resolve(results);
      });
    });*/
    return this._data;
  }
}
