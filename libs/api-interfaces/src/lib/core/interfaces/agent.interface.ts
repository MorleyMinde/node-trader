import * as tf from '@tensorflow/tfjs';
import { Tensor, Sequential, Shape, LayersModel } from '@tensorflow/tfjs';
import { IMemory } from './memory.interface';
import { Rank } from '@tensorflow/tfjs-core';

export interface IModel {
  numStates: number;
  numActions: number;
  getModel(shape: Shape): Sequential;
  train(input: tf.Tensor, output: tf.Tensor);
  predict(input: tf.Tensor): tf.Tensor;
}

interface IAgent<State, Action> {
  /**
   * batchSize to process replays
   */
  batchSize: number;
  discountRate: number;
  episodesToTrain: number;
  act(state: State): Promise<Action>;
  remember(
    state: State,
    action: Action,
    reward: number,
    nextState: State
  ): Promise<void>;
}
export interface IAction {
  getIndex(): number;
}
export abstract class AIAgent<State, Action extends IAction> implements IAgent<State, Action> {
  discountRate:number = 0.9;
  batchSize: 300;
  episodesToTrain: 1000;
  _numStates: number = 25;
  _numActions: number;
  //model: IModel;
  _network: LayersModel;
  constructor(private memory: IMemory<State, Action>) {}

  abstract convertTensorToAction(tensor: Tensor): Action;
  abstract convertStateToTensor(state: State): Tensor;
  async act(state: State): Promise<Action> {
    if (!this._network) {
      this._network = await this.getModel(
        this.convertStateToTensor(state).shape
      );
      this._prepareStates();
    }
    let actionTensor = this.predict(this.convertStateToTensor(state));
    let action = this.convertTensorToAction(actionTensor);
    return action;
  }
  async remember(
    state: State,
    action: Action,
    reward: number,
    nextState: State
  ): Promise<void> {
    this.memory.addSample({
      state: state,
      action: action,
      reward: reward,
      nextState: nextState,
    });
    if (this.memory.isFull()) {
      this.replay();
    }
  }
  _prepareStates() {
    const input: any = this._network.layers[0].input;
    const output: any = this._network.layers[this._network.layers.length - 1]
      .output;
    this._numActions = output.shape[1];
  }
  async initiate(){
    try{
      this._network = await tf.loadLayersModel('file:///home/app/models/my-model/model.json');
      this._network.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
      this._prepareStates();
      console.log('Starting Network');
    }catch(e){
      console.error(e);
    }
  }
  abstract getActionRank(action:Action):number;
  async replay() {
    const batch = await this.memory.sample(this.batchSize);
    if(batch.length == 0){
      return;
    }
    if (!this._network) {
      let state = batch[0].state;
      this._network = this.getModel(
        this.convertStateToTensor(state).shape
      );
      this._prepareStates();
    }
    console.log('Started Training');
    // Sample from memory
    const states = batch.map(({ state }) => state);
    const nextStates = batch.map(({ nextState }) =>
      nextState
        ? this.convertStateToTensor(nextState)
        : tf.zeros([this._numStates])
    );
    // Predict the values of each action at each state
    const qsa = states.map((state) =>
      this.predict(this.convertStateToTensor(state))
    );
    // Predict the values of each action at each next state
    const qsad = nextStates.map((nextState)=>{
      return this.predict(nextState);
    });

    let x = new Array();
    let y = new Array();

    // Update the states rewards with the discounted next states rewards
    batch.forEach(({ state, action, reward, nextState }, index) => {
      const currentQ = qsa[index];
      currentQ[this.getActionRank(action)] = this.convertStateToTensor(nextState)
        ? reward + this.discountRate * qsad[index].max().dataSync()[0]
        : reward;
      x.push(this.convertStateToTensor(state).dataSync());
      y.push(currentQ.dataSync());
    });

    // Clean unused tensors
    qsa.forEach((state) => state.dispose());
    qsad.forEach((state) => state.dispose());

    await this.train(
      tf.tensor2d(x, [x.length, this._numStates]),
      tf.tensor2d(y, [y.length, this._numActions])
    );

    x = [];
    y = [];
    console.log('Finished Replaying');
  }

  async train(xBatch: Tensor<Rank>, yBatch: Tensor<Rank>) {
    await this._network.fit(xBatch, yBatch);
  }
  predict(stateTensor: Tensor): Tensor {
    if (!this._network) {
      this._network = this.getModel(stateTensor.shape);
      this._prepareStates();
    }
    const input: any = this._network.layers[0].input;
    let results: any = this._network.predict(
      stateTensor.reshape(input.shape.map((s) => (s ? s : 1)))
    );
    return results.softmax();
  }
  async saveModel(): Promise<void> {
    await this._network.save('file:///home/app/models/my-model');
  }
  abstract getModel(shape: Shape): Sequential;
}
