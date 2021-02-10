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
  async addSample(sample: Sample<State, Action>): Promise<void> {
    let isample:any = sample;
    await this.samplesRepository.save(isample);
  }
  async sample(batchSize: number = 1000): Promise<ISample<State, Action>[]> {
    let count = await this.samplesRepository.count();
    //console.log('Picking');
    let batch = await this.samplesRepository.find({
      skip:Math.floor(Math.random() * count),
      take: batchSize,
      order:{
        'created':'DESC',
      }
    });
    //console.log(batch.length);
    return batch;
  }
}
