import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LearningModule } from './modules/learning/learning.module';

@Module({
  imports: [
    LearningModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
