import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearningModule } from './modules/learning/learning.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './modules/learning/entities/sample';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LearningModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'trade',
      entities: [Sample],
      synchronize: true,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
