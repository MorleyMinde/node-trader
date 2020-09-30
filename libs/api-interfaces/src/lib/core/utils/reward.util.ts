import { OAndaMarketState } from '../interfaces/trading.interface';

export const calculateReward = (currentSate:OAndaMarketState, previousState:OAndaMarketState) => {
    let reward = 0;
    currentSate.positions.filter((position)=>position.instrument==currentSate.market.instrument).forEach((position)=>{
        reward += parseFloat(position.unrealizedPL)
    })
    return reward;
}