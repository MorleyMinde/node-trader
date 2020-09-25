import { AIAgent, Memory, IModel } from '../interfaces/agent.interface';
import { Action, TradeObservation, Direction } from '../interfaces/trading.interface';
import {
  Tensor,
  Rank,
  Sequential,
  layers,
  tensor,
  sequential,
} from '@tensorflow/tfjs';
import { convertObservationToCandleArray } from './trading-conversion';
import { multinomial } from '@tensorflow/tfjs-core';

class BasicModel implements IModel {
  numStates: number = 5;
  _inputShape;
  numActions: number = 4;
  private _network: Sequential;

  getModel():Sequential{
    let network = new Sequential();
    network.add(
      layers.dense({
        units: 10,
        activation: 'relu',
        // `inputShape` is required only for the first layer.
        inputShape: this._inputShape,
      })
    );
    network.add(
      layers.dense({
        units: 10,
        activation: 'relu',
      })
    );
    network.add(
      layers.dense({
        units: 10,
        activation: 'relu',
      })
    );
    network.add(layers.dense({ units: this.numActions }));

    network.summary();
    network.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return network;
  }
  async train(xBatch: Tensor<Rank>, yBatch: Tensor<Rank>) {
    await this._network.fit(xBatch, yBatch);
  }
  predict(stateTensor:Tensor): Tensor {
    if(!this._network){
      this._inputShape = stateTensor.shape;
      this._network = this.getModel();
    }
    let results = this._network.predict(stateTensor.reshape(this._network.layers[0].input.shape.map((s)=>s?s:1)));
    return results.softmax();
  }
}
export class BasicAgent extends AIAgent<TradeObservation, Action> {
  constructor() {
    super(new Memory(3));
  }

  convertTensorToAction(tensor:Tensor):Action{
    const actions: any[] = [
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.WAIT
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.BUY
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.SELL
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.CLOSE
      }
    ];
    return actions[tensor.dataSync().indexOf(1)]
  }
  convertStateToTensor(state: TradeObservation):Tensor{
    return tensor(convertObservationToCandleArray(state));
  }
  getModel(): IModel{
    return new BasicModel();
  }
}
