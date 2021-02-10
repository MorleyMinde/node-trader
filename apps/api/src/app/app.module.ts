import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearningModule } from './modules/learning/learning.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './modules/learning/entities/sample';
import { ScheduleModule } from '@nestjs/schedule';

console.log(process.env);

@Module({
  imports: [
    LearningModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'trader-db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'trader',
      entities: [Sample],
      synchronize: true,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
