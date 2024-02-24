import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('AttachmentUtils')
const s3_bucket_name = process.env.ATTACHMENT_S3_BUCKET;

export class AttachmentUtils {
    constructor(bucket_name = s3_bucket_name) {
        this.bucket_name = bucket_name;
    }

    async getAttachmentUrl(todoId) {
        try {
            logger.info(`Generating attachment URL for todoId: ${todoId}`);
            const s3Url = `https://${this.bucket_name}.s3.amazonaws.com/${todoId}`;
            logger.info(`Generated attachment URL for todoId: ${todoId}`);
            return s3Url;
        } catch (error) {
            logger.error(`Error generating attachment URL for todoId: ${todoId}`, error);
            throw error;
        }
    }
}