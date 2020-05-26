import * as dotenv from 'dotenv';

// loading .env file
dotenv.config();

export const storageConfig = {
    storageDriver: process.env.TUS_STORAGE_DRIVER || 'local', // valid: 'local', 's3'

    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
    bucket: process.env.AWS_BUCKET,
};
