import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { TusService } from './tus.service';
import { UppyService } from './uppy.service';

@Module({
  controllers: [StorageController],
  providers: [
    TusService,
    UppyService,
  ],
})
export class StorageModule { }
