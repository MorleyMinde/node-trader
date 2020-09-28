import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ISample } from 'libs/api-interfaces/src/lib/core/interfaces/memory.interface';

@Entity()
export class Sample<State, Action> implements ISample<State, Action> {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: () => `now()` })
  created:Date;
  @Column({
    type: 'jsonb',
  })
  state: State;
  @Column({
    type: 'jsonb',
  })
  action: Action;
  @Column()
  reward: number;
  @Column({
    type: 'jsonb',
  })
  nextState: State;
}
