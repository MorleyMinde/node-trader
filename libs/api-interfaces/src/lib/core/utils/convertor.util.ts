import { OAndaMarketState, Position } from '../interfaces/trading.interface';

/*export const convertMarketStateToArray = (state: OAndaMarketState) =>{
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
}*/

export const convertMarketStateToArray = (state: OAndaMarketState) =>{
    let position:Position;
    state.positions.filter((position)=>position.instrument == state.instrument)
    .forEach((pos)=>{
        position = pos;
    })
    let array = state.market.map((candle,index)=>[
        parseFloat(candle.mid.o),                           // Open
        parseFloat(candle.mid.h),                           // High
        parseFloat(candle.mid.l),                           // Low
        parseFloat(candle.mid.c),                           // Close
        candle.volume,                                      //Volume
        position?parseFloat(position.long.units):0,                     // Long Units
        position?position.long.averagePrice?parseFloat(position.long.averagePrice):0:0 ,             // Long Average Price
        position?parseFloat(position.long.financing):0,                        // Long PL
        position?parseFloat(position.long.pl):0,                        // Long PL
        position?parseFloat(position.long.unrealizedPL):0,              // Long UnlrealizedPL
        position?parseFloat(position.long.resettablePL):0,              // Long Resettable PL
        position?parseFloat(position.long.dividendAdjustment):0,        // Long dividendAdjustment
        position?parseFloat(position.long.guaranteedExecutionFees):0,   // Long guaranteedExecutionFees
        position?parseFloat(position.short.units):0,                     // Short Units
        position?position.short.averagePrice?parseFloat(position.short.averagePrice):0:0 ,             // Short Average Price
        position?parseFloat(position.short.financing):0 ,             // Short Average Price
        position?parseFloat(position.short.pl):0,                        // Short PL
        position?parseFloat(position.short.unrealizedPL):0,              // Short UnlrealizedPL
        position?parseFloat(position.short.resettablePL):0,              // Short Resettable PL
        position?parseFloat(position.short.dividendAdjustment):0,        // Short dividendAdjustment
        position?parseFloat(position.short.guaranteedExecutionFees):0,   // Short guaranteedExecutionFees
        position?position.marginUsed?parseFloat(position.marginUsed):0:0,                    // All Units
        position?parseFloat(position.financing):0 ,             // All Financing
        position?parseFloat(position.commission):0 ,             // All Commission
        position?parseFloat(position.pl):0,                        // All PL
        position?parseFloat(position.unrealizedPL):0,              // All UnlrealizedPL
        position?parseFloat(position.resettablePL):0,              // All Resettable PL
        position?parseFloat(position.dividendAdjustment):0,        // All dividendAdjustment
        position?parseFloat(position.guaranteedExecutionFees):0,   // All guaranteedExecutionFees
    ]);
    return array;
}