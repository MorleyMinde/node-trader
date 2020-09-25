import { IMemory, ISample } from '../interfaces/memory.interface';
import { sampleSize } from 'lodash';

export class Memory<State,Action> implements IMemory<State,Action> {
    private samples:ISample<State,Action>[] = new Array();
    /**
     * @param {number} maxMemory
     */
    constructor(private maxMemory) {
      this.maxMemory = maxMemory;
    }
    isFull(): boolean {
      return this.samples.length == this.maxMemory;
    }
    /**
     * @param {Array} sample
     */
    addSample(sample: ISample<State,Action>): Promise<void> {
      this.samples.push(sample);
      if (this.samples.length > this.maxMemory) {
        this.samples.shift();
        /*let [state, , , nextState] = this.samples.shift();
        state.dispose();
        nextState.dispose();*/
      }
      return;
    }
  
    /**
     * @param {number} nSamples
     * @returns {Array} Randomly selected samples
     */
    sample(nSamples) {
      return sampleSize(this.samples, nSamples);
    }
  }