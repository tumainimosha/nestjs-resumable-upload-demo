import { Module, MiddlewareConsumer } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { storageConfig } from 'src/config/storage.config';
import { v4 as uuid } from 'uuid';
import { TusService } from './tus.service';
import companion = require('@uppy/companion')
import { UppyService } from './uppy.service';

@Module({
  controllers: [StorageController],
  providers: [
    TusService,
    UppyService,
  ],
})
export class StorageModule { }
