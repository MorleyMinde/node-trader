import * as tf from '@tensorflow/tfjs';
import { Tensor, Sequential, Shape } from '@tensorflow/tfjs';
import { IMemory } from './memory.interface';

export interface IModel {
  numStates: number;
  numActions: number;
  getModel(shape:Shape):Sequential;
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
  ): Promise<void>
}

export abstract class AIAgent<State, Action> implements IAgent<State, Action> {
  discountRate: 0.9;
  batchSize: 300;
  episodesToTrain: 1000;
  model: IModel;
  constructor(
    private memory: IMemory<State,Action>
  ) {
    this.model = this.getModel();
  }

  abstract convertTensorToAction(tensor: Tensor): Action;
  abstract convertStateToTensor(state: State): Tensor;
  async act(state: State): Promise<Action> {
    let actionTensor = this.model.predict(this.convertStateToTensor(state));
    let action = this.convertTensorToAction(actionTensor);
    return action;
  }
  async remember(
    state: State,
    action: Action,
    reward: number,
    nextState: State
  ): Promise<void>{
    this.memory.addSample(
      {
        state: state,
        action: action,
        reward: reward,
        nextState: nextState
      }
    );
    if (this.memory.isFull()) {
      this.replay();
    }
  }
  async replay() {
    const batch = await this.memory.sample(this.batchSize);
    console.log('Started Training');
    // Sample from memory
    const states = batch.map(({state}) => state);
    const nextStates = batch.map(({nextState}) =>
      nextState ? this.convertStateToTensor(nextState) : tf.zeros([this.model.numStates])
    );
    // Predict the values of each action at each state
    const qsa = states.map((state) => this.model.predict(this.convertStateToTensor(state)));
    // Predict the values of each action at each next state
    const qsad = nextStates.map((nextState) => this.model.predict(nextState));

    let x = new Array();
    let y = new Array();

    // Update the states rewards with the discounted next states rewards
    batch.forEach(({state, action, reward, nextState}, index) => {
      const currentQ = qsa[index];
      //currentQ[action] = this.convertStateToTensor(nextState)
      currentQ[action] = this.convertStateToTensor(nextState)
        ? reward + this.discountRate * qsad[index].max().dataSync()
        : reward;
      x.push(this.convertStateToTensor(state).dataSync());
      y.push(currentQ.dataSync());
    });

    // Clean unused tensors
    qsa.forEach((state) => state.dispose());
    qsad.forEach((state) => state.dispose());

    // Learn the Q(s, a) values given associated discounted rewards
    await this.model.train(
      tf.tensor2d(x, [x.length, this.model.numStates]),
      tf.tensor2d(y, [y.length, this.model.numActions])
    );

    x = [];
    y = [];
    console.log('Finished Replaying');
  }

  abstract getModel(): IModel;
}
