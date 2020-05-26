import { Injectable, OnModuleInit } from '@nestjs/common';
import tus = require('tus-node-server');
import { storageConfig } from 'src/config/storage.config';
import { v4 as uuid } from 'uuid';
import { FileMetadata } from './models/file-metadata.model';


@Injectable()
export class StorageService implements OnModuleInit {

    private readonly tusServer = new tus.Server();

    onModuleInit() {
        console.log(`The Storage Module has been initialized.`);

        switch (storageConfig.storageDriver) {
            case 'local':
                this.tusServer.datastore = new tus.FileStore({
                    path: '/local-store',
                    namingFunction: this.fileNameFromRequest,
                });

                break;

            case 's3':

                this.tusServer.datastore = new tus.S3Store({
                    path: '/s3-store',
                    namingFunction: this.fileNameFromRequest,
                    bucket: storageConfig.bucket,
                    accessKeyId: storageConfig.accessKeyId,
                    secretAccessKey: storageConfig.secretAccessKey,
                    region: storageConfig.region,
                    partSize: 8 * 1024 * 1024, // each uploaded part will have ~8MB,
                    tmpDirPrefix: 'tus-s3-store',
                });

                break;

            default:
                throw 'Invalid storage driver' + storageConfig.storageDriver;
        }

        this.tusServer.on(tus.EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
            console.log(`Upload complete for file ${JSON.stringify(event.file)}`);
        });
    }

    private fileNameFromRequest = (req) => {
        try {
            const metadata = this.getFileMetadata(req);

            const prefix: string = uuid();

            const fileName = metadata.extension ? prefix + '.' + metadata.extension : prefix;

            return fileName;
        } catch (e) {
            console.error(e);

            // rethrow error
            throw e;
        }
    }

    private getFileMetadata(req: any): FileMetadata {
        const uploadMeta: string = req.header('Upload-Metadata');
        const metadata = new FileMetadata();

        uploadMeta.split(',').map(item => {
            const tmp = item.split(' ');
            const key = tmp[0];
            const value = Buffer.from(tmp[1], 'base64').toString('ascii');;
            metadata[`${key}`] = value;
        });

        let extension: string = (metadata.name) ? metadata.name.split('.').pop() : null;
        extension = extension && extension.length === 3 ? extension : null;
        metadata.extension = extension;

        return metadata;
    }

    handleTus(req, res) {
        return this.tusServer.handle(req, res);
    }

}
