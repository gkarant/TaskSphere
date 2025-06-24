import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads folder if it doesn't exist
const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Configure Multer storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs only (customize as needed)
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true)
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5 MB
});

