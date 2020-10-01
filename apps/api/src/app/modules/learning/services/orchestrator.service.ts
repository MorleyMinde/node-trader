import { OAndaTrader } from 'libs/api-interfaces/src/lib/core/impl/oanda-trader';
import { AondaBasicAgent } from 'libs/api-interfaces/src/lib/core/impl/agent.impl';
import { Injectable, Logger } from '@nestjs/common';
import {
  Granularity,
  OAndaMarketState,
  OandaAction,
} from 'libs/api-interfaces/src/lib/core/interfaces/trading.interface';
import { DatabaseMemory } from '../memory/database.memory';
import { Sample } from '../entities/sample';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class Orchestrator {
    private readonly logger = new Logger(Orchestrator.name);
    tradingEnvironment: OAndaTrader;
    agent: AondaBasicAgent;
  constructor(
    @InjectRepository(Sample)
    private samplesRepository: Repository<Sample<OAndaMarketState, OandaAction>>
  ) {
    let memory: DatabaseMemory<OAndaMarketState, OandaAction> = new DatabaseMemory(
      this.samplesRepository
    );
    this.agent = new AondaBasicAgent(process.env.INSTRUMENT, memory);
    if(process.env.MODE == 'train'){
      console.log('Start Training');
      this.replay();
    }else if(process.env.MODE == 'trade'){
      console.log('Start Trading');
      this.trade();
    }
  }
  replaying = false;
  async replay() {
    while(true){
      await this.agent.initiate();
      await this.agent.replay();
      await this.agent.saveModel();
    }
  }
  async trade(){
    this.tradingEnvironment = new OAndaTrader(process.env.INSTRUMENT, Granularity.S5);

    
    this.run();
  }
  async run() {
    await this.agent.initiate();
    let currentState;// = await this.tradingEnvironment.reset();
    let action;
    let done = false;
    this.tradingEnvironment.onMarketChange(async (nextState)=>{
      
      if(currentState){
        this.agent.remember(currentState, action, this.tradingEnvironment.calculateReward(currentState, nextState), nextState);
      }
      action = await this.agent.act(nextState);
      currentState = nextState;
      this.tradingEnvironment.act(action);
    });
    /*while (!done) {
      let action = await this.agent.act(state);
      let results = await this.tradingEnvironment.step(action);
      done = results.done;
      if(!results.done){
        await this.agent.remember(state, action, results.reward, results.state);
      }
    }*/
    console.log('Done');
    
  }
}
