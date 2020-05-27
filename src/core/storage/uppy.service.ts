import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import companion = require('@uppy/companion')
import { storageConfig } from 'src/config/storage.config';
import { v4 as uuid } from 'uuid';


@Injectable()
export class UppyService implements OnModuleInit {

    private logger = new Logger('UppyService');

    private companionServer;

    onModuleInit() {
        this.initializeCompanionServer();
    }

    async handleCompanion(req, res) {
        return this.companionServer.handle(req, res);
    }

    private initializeCompanionServer() {

        this.logger.verbose(`Initializing Companion Server.`);

        const tempDirectory = require('temp-dir') + '/';
        const options = {
            providerOptions: {
                s3: {
                    key: storageConfig.accessKeyId,
                    secret: storageConfig.secretAccessKey,
                    bucket: storageConfig.bucket,
                    region: storageConfig.region,
                    getKey: (req, filename, metadata) => {
                        let extension: string = (filename) ? filename.split('.').pop() : null;
                        extension = extension && extension.length === 3 ? extension : null;
                        const prefix: string = uuid();
                        const s3filname = extension ? prefix + '.' + extension : prefix;
                        return s3filname;
                    },
                    awsClientOptions: {
                        acl: 'private'
                    },
                    redisOptions: {
                        host: '127.0.0.1',
                        port: '6379',
                    }
                }
            },
            server: {
                host: '127.0.0.1:3000',
                protocol: 'http',
                path: 'uppy-companion',
            },
            secret: 'Cplh4ISm9QGTW739qw9m3w==',
            filePath: tempDirectory,
            debug: true,
        };

        this.companionServer = companion.app(options);
    }
}
