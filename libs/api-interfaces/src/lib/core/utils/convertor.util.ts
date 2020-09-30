import { OAndaMarketState } from '../interfaces/trading.interface';

export const convertMarketStateToArray = (state: OAndaMarketState) =>{
    let array = new Array(24);
    let date = new Date(state.market.time);
    let beginingOfDay = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
    array[0] = (date.getTime() - beginingOfDay.getTime())/(1000*60*60*24);
    array[1] = parseFloat(state.market.bids[0].price);
    array[2] = parseFloat(state.market.asks[0].price);
    array[3] = state.market.bids[0].liquidity/10000000;
    array[4] = state.market.asks[0].liquidity/10000000;
    array[5] = parseFloat(state.account.marginRate);
    array[6] = parseFloat(state.account.balance)/100;
    array[7] = state.account.openTradeCount;
    array[8] = state.account.openPositionCount;
    array[9] = state.account.pendingOrderCount;
    array[10] = parseFloat(state.account.financing);
    array[11] = parseFloat(state.account.commission);
    array[12] = parseFloat(state.account.guaranteedExecutionFees);
    array[13] = parseFloat(state.account.unrealizedPL);
    array[14] = parseFloat(state.account.NAV)/100;
    array[15] = parseFloat(state.account.marginUsed);
    array[16] = parseFloat(state.account.marginAvailable)/100;
    array[17] = parseFloat(state.account.positionValue)/100;
    array[18] = parseFloat(state.account.marginCloseoutUnrealizedPL);
    array[19] = parseFloat(state.account.marginCloseoutNAV)/100;
    array[20] = parseFloat(state.account.marginCloseoutMarginUsed);
    array[21] = parseFloat(state.account.marginCloseoutPositionValue)/100;
    array[22] = parseFloat(state.account.marginCloseoutPercent);
    array[23] = parseFloat(state.account.withdrawalLimit)/100;
    array[24] = parseFloat(state.account.marginCallPercent);
    return array;
}