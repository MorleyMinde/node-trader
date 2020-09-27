import { OAndaTrader } from 'libs/api-interfaces/src/lib/core/impl/oanda-trader';
import { AondaBasicAgent } from 'libs/api-interfaces/src/lib/core/impl/agent.impl';
import { Injectable, Logger } from '@nestjs/common';
import {
  Granularity,
  OAndaMarketState,
  Action,
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
    private samplesRepository: Repository<Sample<OAndaMarketState, Action>>
  ) {
    this.tradingEnvironment = new OAndaTrader(Granularity.S5);

    let memory: DatabaseMemory<OAndaMarketState, Action> = new DatabaseMemory(
      this.samplesRepository
    );
    this.agent = new AondaBasicAgent(memory);
    this.run();
  }
  replaying = false;
  @Cron('* * * * * *')
  async replay() {
    if(!this.replaying){
        this.logger.debug('Called when the current second is 45');
        this.replaying = true;
        await this.agent.replay();
        this.replaying = false;
    }
  }
  async run() {
    
    let state = await this.tradingEnvironment.reset();
    let done = false;
    while (!done) {
      let action = await this.agent.act(state);
      let results = await this.tradingEnvironment.step(action);
      done = results.done;
      if(!results.done){
        await this.agent.remember(state, action, results.reward, results.state);
      }
      console.log(`Action:${action.side} Reward:${results.reward}`);
    }
    console.log('Done');
    
  }
}
