import { Module, Global } from '@nestjs/common';
import { LearningService } from './services/learning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './entities/sample';
import { Orchestrator } from './services/orchestrator.service';
import { DatabaseMemory } from './memory/database.memory';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Sample])
    ],
    providers: [
        LearningService,
        Orchestrator
    ]
})
export class LearningModule {
}
