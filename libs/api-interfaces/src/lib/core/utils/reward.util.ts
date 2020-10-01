import { OAndaMarketState } from '../interfaces/trading.interface';

export const calculateReward = (currentSate:OAndaMarketState|any, nextState:OAndaMarketState|any) => {
    let currentPositions = currentSate.positions.filter((position)=>position.instrument==currentSate.instrument);
    let nextPositions = nextState.positions.filter((position)=>position.instrument==currentSate.instrument);
    if(currentPositions.length > 0 && nextPositions.length > 0){
        let currentReward = 0;
        currentPositions.forEach((position)=>{
            currentReward += parseFloat(position.unrealizedPL)
        });
        let nextReward = 0;
        nextPositions.forEach((position)=>{
            nextReward += parseFloat(position.unrealizedPL)
        });
        return nextReward - currentReward;
    }
    if(currentPositions.length > 0){
        let currentReward = 0;
        currentPositions.forEach((position)=>{
            currentReward += parseFloat(position.unrealizedPL)
        });
        return currentReward;
    }
    if(nextPositions.length > 0){
        let nextReward = 0;
        nextPositions.forEach((position)=>{
            nextReward += parseFloat(position.unrealizedPL)
        });
        return nextReward;
    }
    return 0;
}