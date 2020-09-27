import {
  IMemory,
  ISample,
} from 'libs/api-interfaces/src/lib/core/interfaces/memory.interface';
import { Sample } from '../entities/sample';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Injectable } from '@nestjs/common';

export class DatabaseMemory<State, Action> implements IMemory<State, Action> {
  constructor(
    private samplesRepository: Repository<Sample<State,Action>>,
  ) {}
  isFull(): boolean {
    return false;
  }
  async addSample(sample: ISample<State, Action>): Promise<void> {
    await this.samplesRepository.save(sample);
  }
  async sample(batchSize: any): Promise<ISample<State, Action>[]> {
    let batch = await this.samplesRepository.find({
      skip:1,
      take:10000,
      order:{
        'created':'DESC',
      }
    });
    console.log(batch.map((d)=>d.created));
    return batch;
  }
}
