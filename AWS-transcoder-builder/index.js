// importing require modules
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { SQSClient, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const fs = require("node:fs/promises");
const fs2 = require("node:fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// ENV VARIABLES
const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;
const ID = process.env.ID;
const DEST_BUCKET = process.env.S3_DESTINATION_BUCKET || "final-output-prod";
const SQS_RECEIPT_HANDLE = process.env.SQS_RECEIPT_HANDLE;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

// CONSTANT VARIABLES/VALUES
const RESOLUTIONS = [
    { name: "360p", width: 480, height: 360 },
    { name: "480p", width: 858, height: 480 },
    { name: "720p", width: 1280, height: 720 },
    { name: "1080p", width: 1920, height: 1080 },
];

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: (credentials.accessKeyId && credentials.secretAccessKey) ? credentials : undefined
});

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: (credentials.accessKeyId && credentials.secretAccessKey) ? credentials : undefined
});

// MAIN EXECUTION
async function initProcess() {
    console.log(`Downloading raw video: ${KEY} from ${BUCKET_NAME}...`);
    const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY
    });

    const { Body } = await s3Client.send(getCommand);
    const rawVideoPath = path.resolve("video-raw-video.mp4");

    await fs.writeFile(rawVideoPath, Body);
    console.log("Download complete. Starting sequential transcoding...");

    // SEQUENTIAL PROCESSING to avoid CPU/Memory exhaustion
    for (const res of RESOLUTIONS) {
        const outputFilename = `video-${res.name}.mp4`;
        const outputPath = path.resolve(outputFilename);

        console.log(`Starting ${res.name} transcoding...`);
        await new Promise((resolve, reject) => {
            ffmpeg(rawVideoPath)
                .output(outputPath)
                .videoCodec("libx264")
                .withAudioCodec("aac")
                .withSize(`${res.width}x${res.height}`)
                .format("mp4")
                .on("start", (cmd) => console.log(`FFmpeg command for ${res.name}: ${cmd}`))
                .on("end", async () => {
                    console.log(`${res.name} transcode finished. Uploading to S3...`);
                    const putCommand = new PutObjectCommand({
                        Bucket: DEST_BUCKET,
                        Key: `${ID}/${outputFilename}`,
                        Body: fs2.createReadStream(outputPath)
                    });
                    await s3Client.send(putCommand);
                    console.log(`Successfully uploaded ${res.name}`);
                    resolve();
                })
                .on("error", (err) => {
                    console.error(`Error during ${res.name} transcoding:`, err);
                    reject(err);
                })
                .run();
        });
    }

    console.log("All resolutions processed successfully.");

    // Delete SQS message upon total success
    if (SQS_RECEIPT_HANDLE && SQS_QUEUE_URL) {
        console.log("Deleting SQS message...");
        const deleteCommand = new DeleteMessageCommand({
            QueueUrl: SQS_QUEUE_URL,
            ReceiptHandle: SQS_RECEIPT_HANDLE
        });
        await sqsClient.send(deleteCommand);
        console.log("SQS message deleted.");
    }
}

initProcess()
    .then(() => {
        console.log("Pipeline Finished Successfully.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Pipeline Failed:", err);
        process.exit(1);
    });

