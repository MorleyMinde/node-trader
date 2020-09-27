import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sample<State, Action> {
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
