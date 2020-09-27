import { AIAgent, IModel } from '../interfaces/agent.interface';
import { Action, Direction, OAndaMarketState } from '../interfaces/trading.interface';
import {
  Tensor,
  Rank,
  Shape,
  Sequential,
  layers,
  tensor,
  sequential,
} from '@tensorflow/tfjs';
import { convertObservationToCandleArray } from './trading-conversion';
import { multinomial, sigmoid, div, sum } from '@tensorflow/tfjs-core';
import { Memory } from './memory.impl';
import { convertMarketStateToArray } from '../utils/convertor.util';
import { IMemory, ISample } from '../interfaces/memory.interface';

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
abstract class ModelImpl implements IModel {
  numStates: number;
  numActions: number;
  private _network: Sequential;

  abstract getModel(shape:Shape):Sequential;
  async train(xBatch: Tensor<Rank>, yBatch: Tensor<Rank>) {
    await this._network.fit(xBatch, yBatch);
  }

  predict(stateTensor:Tensor): Tensor {
    if(!this._network){
      this._network = this.getModel(stateTensor.shape);
      const input:any = this._network.layers[0].input;
      this.numStates = input.shape[1];
      const output:any = this._network.layers[this._network.layers.length - 1].output;
      this.numActions = output.shape[1];
    }
    const input:any = this._network.layers[0].input;
    let results:any = this._network.predict(stateTensor.reshape(input.shape.map((s)=>s?s:1)));
    return results.softmax();
  }
}

class BasicModel extends ModelImpl {
  numActions: number = 4;
  getModel(shape:Shape):Sequential{
    let network = new Sequential();
    network.add(
      layers.dense({
        units: 10,
        activation: 'relu',
        // `inputShape` is required only for the first layer.
        inputShape: shape,
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
}
export class AondaBasicAgent extends AIAgent<OAndaMarketState, Action> {
  batchSize: 300;
  constructor(memory:IMemory<OAndaMarketState, Action>) {
    super(memory);
  }

  convertTensorToAction(tensor:Tensor):Action{
    const sig = tensor.sigmoid();
    
    const probs:any = div(sig, sum(sig));
    let action = actions[multinomial(probs, 1).dataSync()[0]];
    if(action){
      return action;
    }else{
      throw Error("Action undefined");
    }
  }
  convertStateToTensor(state: OAndaMarketState):Tensor{
    return tensor(convertMarketStateToArray(state));
  }
  getModel(): IModel{
    return new BasicModel();
  }
}
