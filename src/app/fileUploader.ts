"use server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//S3 Config
const s3Config = {
    bucketName: process.env.AWS_BUCKET_NAME as string,
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
}

export const UploadDoc = async (buffer: Buffer, key: string) => {
    try {
        const file = buffer
        const folderName = key as string;
        const s3 = new S3Client({
            ...s3Config,
        });

        const command = new PutObjectCommand({
            Bucket: s3Config.bucketName,
            Key: key,
            Body: buffer,
            ACL: 'public-read',
            CacheControl: 'no-cache',
            ContentType: 'officedocument.wordprocessingml.document',
          });

        const response = await s3.send(command);
        console.log(response);

        return response;
    } catch (e) {
        console.log(e)
        return "Image Upload failed"
    }
}