export interface ISample<State,Action>{
    instrument:string;
    state: State;
    action: Action;
    reward: number;
    nextState: State;
}
export interface IMemory<State,Action> {
    isFull(): boolean;
    /**
     * @param {Array} sample
     */
    addSample(sample:ISample<State,Action>):Promise<void>;
  
    /**
     * @param {number} nSamples
     * @returns {Array} Randomly selected samples
     */
    sample(batchSize):Promise<ISample<State,Action>[]>
  }