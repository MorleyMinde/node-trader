import { AIAgent, IModel, IAction } from '../interfaces/agent.interface';
import {
  Direction,
  OAndaMarketState,
  OandaAction,
} from '../interfaces/trading.interface';
import {
  Tensor,
  Rank,
  Shape,
  Sequential,
  layers,
  tensor,
} from '@tensorflow/tfjs';
import { convertObservationToCandleArray } from './trading-conversion';
import { multinomial, sigmoid, div, sum } from '@tensorflow/tfjs-core';
import { Memory } from './memory.impl';
import { convertMarketStateToArray } from '../utils/convertor.util';
import { IMemory, ISample } from '../interfaces/memory.interface';

const actions: OandaAction[] = [
  new OandaAction('EUR_USD', 100, Direction.WAIT),
  new OandaAction('EUR_USD', 100, Direction.BUY),
  new OandaAction('EUR_USD', 100, Direction.SELL),
  new OandaAction('EUR_USD', 100, Direction.CLOSE),
];

export class AondaBasicAgent extends AIAgent<OAndaMarketState, OandaAction> {
  batchSize: 300;
  constructor(memory: IMemory<OAndaMarketState, OandaAction>) {
    super(memory);
  }

  convertTensorToAction(tensor: Tensor): OandaAction {
    const sig = tensor.sigmoid();
    const probs: any = div(sig, sum(sig));
    let action = actions[multinomial(probs, 1).dataSync()[0]];
    if (action) {
      return action;
    } else {
      throw Error('Action undefined');
    }
  }
  convertStateToTensor(state: OAndaMarketState): Tensor {
    let t = tensor(convertMarketStateToArray(state));
    return t;
  }
  getActionRank(action: OandaAction) {
    return action.side;
  }
  getModel(shape: Shape): Sequential {
    let network = new Sequential();
    network.add(
      layers.dense({
        units: 128,
        activation: 'relu',
        // `inputShape` is required only for the first layer.
        inputShape: shape,
      })
    );
    network.add(
      layers.dense({
        units: 512,
        activation: 'relu',
        useBias: true
      })
    );
    network.add(
      layers.dense({
        units: 512,
        activation: 'relu',
        useBias: true
      })
    );
    network.add(
      layers.dense({
        units: 128,
        activation: 'relu',
        useBias: true
      })
    );
    network.add(
      layers.dense({
        units: 128,
        activation: 'relu',
      })
    );
    network.add(
      layers.dense({
        units: 64,
        activation: 'relu',
        useBias: true
      })
    );
    network.add(layers.dense({ units: 4 }));

    network.summary();
    network.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return network;
  }
}
