import { Injectable, OnModuleInit } from '@nestjs/common';
import companion = require('@uppy/companion')
import { storageConfig } from 'src/config/storage.config';
import { v4 as uuid } from 'uuid';
import { FileMetadata } from './models/file-metadata.model';


@Injectable()
export class UppyService implements OnModuleInit {

    private companionServer;

    onModuleInit() {
        console.log(`The Storage Module has been initialized.`);


        const tempDirectory = require('temp-dir') + '/';

        const options = {
            providerOptions: {
                s3: {
                    key: storageConfig.accessKeyId,
                    secret: storageConfig.secretAccessKey,
                    bucket: storageConfig.bucket,
                    region: storageConfig.region,
                    getKey: (req, filename, metadata) => {
                        return uuid() + '-' + filename;
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
        }

        this.companionServer = companion.app(options);
    }

    // private fileNameFromRequest = (req, filename, metadata) => {
    //     try {
    //         const metadata = this.getFileMetadata(req);

    //         const prefix: string = uuid();

    //         const s3filname = metadata.extension ? prefix + '.' + metadata.extension : prefix;

    //         return fileName;
    //     } catch (e) {
    //         console.error(e);

    //         // rethrow error
    //         throw e;
    //     }
    // }

    // private getFileMetadata(req: any): FileMetadata {
    //     const uploadMeta: string = req.header('Upload-Metadata');
    //     const metadata = new FileMetadata();

    //     uploadMeta.split(',').map(item => {
    //         const tmp = item.split(' ');
    //         const key = tmp[0];
    //         const value = Buffer.from(tmp[1], 'base64').toString('ascii');;
    //         metadata[`${key}`] = value;
    //     });

    //     let extension: string = (metadata.name) ? metadata.name.split('.').pop() : null;
    //     extension = extension && extension.length === 3 ? extension : null;
    //     metadata.extension = extension;

    //     return metadata;
    // }

    handleCompanion(req, res) {
        return this.companionServer.handle(req, res);
    }

}
