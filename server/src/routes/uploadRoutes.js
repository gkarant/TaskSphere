import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import s3Upload from '../middlewares/s3Uploader.js';
import { s3UploadController } from '../controllers/uploadController.js';
import { getPresignedUrl } from '../controllers/presignedController.js';
const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
    });
});

//Route to upload file to S3
router.post('/s3', s3Upload.single('file'), s3UploadController);

router.get('/s3/presignedurl', getPresignedUrl);

export default router; 