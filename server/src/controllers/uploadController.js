export const s3UploadController = (req, res) => {
    try {
        console.log('Uploaded file info:', req.file); //
        if (!req.file || !req.file.location) {
            return res.status(400).json({ message: 'file upload failed' });
        }

        res.status(200).json({
            message: 'File upload to S3 successful',
            fileUrl: req.file.location,  //Public URL from S3
        });

    } catch (err) {
        res.status(500).json({ message: 'Error uploading file to S3' })
    }
}