import { Module, Global } from '@nestjs/common';
import { LearningService } from './services/learning.service';

@Global()
@Module({
    providers: [LearningService]
})
export class LearningModule {
}
