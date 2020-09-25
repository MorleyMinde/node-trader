import { OAndaTrader } from './oanda-trader';
import { BasicAgent } from './agent.impl';
import { Granularity } from '../interfaces/trading.interface';

const MIN_EPSILON = 0.01;
const MAX_EPSILON = 0.2;
const LAMBDA = 0.01;

export class Orchestrator {
    /**
     * @param {number} position
     * @returns {number} Reward corresponding to the position
     */
    computeReward(position) {
        let reward = 0;
        if (position >= 0) {
            reward = 5;
        } else if (position >= 0.1) {
            reward = 10;
        } else if (position >= 0.25) {
            reward = 20;
        } else if (position >= 0.5) {
            reward = 100;
        }
        return reward;
    }

    async run() {
        let tradingEnvironment: OAndaTrader = new OAndaTrader(Granularity.S5);
        let agent = new BasicAgent();
        let state = await tradingEnvironment.reset();
        while (true) {
            let action = await agent.act(state);
            let results = await tradingEnvironment.step(action);
            await agent.remember(
                state,
                action,
                results.reward,
                results.observation
            );
        }
    }
}