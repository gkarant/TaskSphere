import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Load env from infra
dotenv.config({ path: path.resolve(__dirname, '../../../infra/.env') });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    regiod: process.env.AWS_REGION

});

export const generatePresignedUrl = (key) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: 60 //60 seconds validity
    };

    return s3.getSignedUrlPromise('getObject', params);
};