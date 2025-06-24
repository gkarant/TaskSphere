import { generatePresignedUrl } from "../middlewares/s3Presigner.js";

export const getPresignedUrl = async (req, res) => {
    const { key } = req.query;

    if (!key) {
        return res.sttus(400).json({ success: false, message: 'Key is required' });
    }

    try {

        const url = await generatePresignedUrl(key);
        res.status(200).json({ success: true, url })

    } catch (err) {
        res.status(200).json({
            success: false,
            message: 'Failed to generate url',
            error: err.message
        });
    }
};