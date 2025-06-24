import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../infra/.env') }); // go 3 levels up

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
//console.log("S3 Bucket from ENV:", process.env.AWS_S3_BUCKET_NAME);

const s3Upload = multer({
    storage: multerS3(
        {
            s3: s3,
            bucket: process.env.AWS_S3_BUCKET_NAME,//process.env.AWS_S3_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = file.originalname.split('.').pop();
                const s3Key = `uploads/${file.fieldname}-${uniqueSuffix}.${extension}`;
                //console.log("👉 S3 Key:", s3Key); // ADD THIS LOG
                // cb(null, s3Key);
                cb(null, `uploads/${file.fieldname}-${uniqueSuffix}.${extension}`);
            }
        })
});

export default s3Upload;