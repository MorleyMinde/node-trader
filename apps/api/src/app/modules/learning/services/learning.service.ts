import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'net';
import { Orchestrator } from '@my/api-interfaces';

@WebSocketGateway()
@Injectable()
export class LearningService implements OnGatewayConnection{
  //trader: OAndaTrader = new OAndaTrader();
  client:Socket;
  constructor() {
    console.log('Here');
    this.run2();
  }
  handleConnection(client: any, ...args: any[]) {
    this.client = client;
  }
  async run2(){
    let orchestrator = new Orchestrator();
    orchestrator.run();
  }
  /*async run() {
    const actions: Action[] = [
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.WAIT,
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.BUY,
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.SELL,
      },
      {
        instrument: 'EUR_USD',
        units: 100,
        side: Direction.CLOSE,
      },
    ];
    const agent = new QLearningAgent(
      actions,
      decayingEpsilonSoftmaxGreedyPickAction(0.05, 0.99, 3000)
    );
    let betsScore = -Infinity;

    console.log('Start maze');
    for (let numberOfPlay = 0; numberOfPlay < Infinity; numberOfPlay++) {
      let score = 0;
      let endGame = false;
      const maxSteps = 10000;
      let stepCount = 0;
      let observation = await this.trader.reset();
      while (!endGame) {
        //console.log('Starting Episode');
        const step = await agent.play(observation);
        let result = await this.trader.step(step.action);
        if(this.client){
          this.client.emit('step',result);
        }
        await agent.reward(step, result.reward);
        score += result.reward;
        if (result.done && betsScore < score) {
          betsScore = score;
          const memorySize = await agent.memory.size();
          console.log(`
      -------------------------------
        numberOfPlay: ${numberOfPlay},
        score: ${score}
        episode: ${agent.episode}
        memorySize: ${memorySize}
      -------------------------------
              `);
        }
        stepCount += 1;
        if (stepCount > maxSteps) {
          break;
        }
        endGame = result.done;
      }
      await agent.learn();
    }
  }*/

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket,): string {
    console.log('Received Data:', data);
    this.client = client;
    return data;
  }
}
