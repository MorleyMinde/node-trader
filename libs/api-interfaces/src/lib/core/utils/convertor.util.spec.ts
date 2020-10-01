import {convertMarketStateToArray} from './convertor.util'

describe('Convertor', () => {
  describe('Test Convertion of state to Array', () => {
    it('should return "Welcome to api!"', () => {
      let data = {
          market:{
            type: 'PRICE',
            time: '2020-09-25T15:19:26.360902409Z',
            bids: [{ price: '1.16188', liquidity: 10000000 }],
            asks: [{ price: '1.16199', liquidity: 9999900 }],
            closeoutBid: '1.16188',
            closeoutAsk: '1.16199',
            status: 'tradeable',
            tradeable: true,
            instrument: 'EUR_USD',
          },
          positions:[],
          account: { guaranteedStopLossOrderMode: 'DISABLED',
          hedgingEnabled: false,
          id: '101-004-7236112-001',
          createdTime: '2017-11-25T10:49:58.337676759Z',
          currency: 'USD',
          createdByUserID: 7236112,
          alias: 'Primary',
          marginRate: '0.02',
          lastTransactionID: '23517',
          balance: '79.6400',
          openTradeCount: 0,
          openPositionCount: 0,
          pendingOrderCount: 0,
          pl: '-1032.0462',
          resettablePL: '-1032.0462',
          resettablePLTime: '2017-11-25T10:49:58.337676759Z',
          financing: '11.6862',
          commission: '0.0000',
          dividendAdjustment: '0',
          guaranteedExecutionFees: '0.0000',
          unrealizedPL: '0.0000',
          NAV: '79.6400',
          marginUsed: '0.0000',
          marginAvailable: '79.6400',
          positionValue: '0.0000',
          marginCloseoutUnrealizedPL: '0.0000',
          marginCloseoutNAV: '79.6400',
          marginCloseoutMarginUsed: '0.0000',
          marginCloseoutPositionValue: '0.0000',
          marginCloseoutPercent: '0.00000',
          withdrawalLimit: '79.6400',
          marginCallMarginUsed: '0.0000',
          marginCallPercent: '0.00000' }
      };
      let array = convertMarketStateToArray(data);
      //minutes after start of the week
      expect(array[0]).toEqual(0.763499537037037);
      //biding price
      expect(array[1]).toEqual(1.16188);
      //asking price
      expect(array[2]).toEqual(1.16199);
      //bid liquidity
      expect(array[3]).toEqual(1);
      //ask liquidity
      expect(array[4]).toEqual(0.99999);
      //margin Rate 
      expect(array[5]).toEqual(0.02);
      //balance 79.6400
      /*expect(array[6]).toEqual(79.6400);
      //openTradeCount
      expect(array[7]).toEqual(0);
      // openPositionCount
      expect(array[8]).toEqual(0);
      //pendingOrderCount
      expect(array[9]).toEqual(0);
      //financing
      expect(array[10]).toEqual(11.6862);
      //commission
      expect(array[11]).toEqual(0.0000);
      //guaranteedExecutionFees
      expect(array[12]).toEqual(0.0000);
      //unrealizedPL
      expect(array[13]).toEqual(0.0000);
      //NAV
      expect(array[14]).toEqual(79.6400);
      //marginUsed
      expect(array[15]).toEqual(0.0000);
      //marginAvailable
      expect(array[16]).toEqual(79.6400);
      //positionValue
      expect(array[17]).toEqual(0.0000);
      //marginCloseoutUnrealizedPL
      expect(array[18]).toEqual(0.0000);
      //marginCloseoutNAV
      expect(array[19]).toEqual(79.6400);
      //marginCloseoutMarginUsed
      expect(array[20]).toEqual(0.0000);
      //marginCloseoutPositionValue
      expect(array[21]).toEqual(0.0000);
      //marginCloseoutPercent
      expect(array[22]).toEqual(0.00000);
      //withdrawalLimit
      expect(array[23]).toEqual(79.6400);
      //marginCallPercent
      expect(array[24]).toEqual(0.00000);*/
    });
  });
});
