import { S3Event } from "aws-lambda";
import { GetDeleteMessageCommand, GetTaskCommand, queeRecivedCommand } from "./commands/command";
import { ecsClient, SqsClient } from "./config";
import {v4} from "uuid"


async function init() {
    console.log("Video Consumer started...");
    while (true) {
        try {
            const { Messages } = await SqsClient.send(queeRecivedCommand);
            if (!Messages) {
                // console.log("no messages")
                continue;
            }

            for (const message of Messages) {
                const { Body } = message;
                if (!Body) continue;

                const event = JSON.parse(Body) as S3Event;
                if ("Service" in event && "Event" in event) {
                    if (event.Event === "s3:TestEvent") {
                        console.log("Received S3 Test Event");
                        // Delete test events immediately
                        await SqsClient.send(GetDeleteMessageCommand(message.ReceiptHandle!));
                        continue;
                    }
                }

                if (!event.Records) continue;

                for (const record of event.Records) {
                    const { s3: { bucket, object } } = record;
                    console.log(`Processing video: ${object.key} from bucket: ${bucket.name}`);
                    
                    // We pass the ReceiptHandle so the Transcoder can delete the message upon success.
                    // This ensures reliable processing.
                    const taskCommand = GetTaskCommand(bucket.name, object.key, v4(), message.ReceiptHandle!);
                    
                    // Spin up ECS task
                    await ecsClient.send(taskCommand);
                    console.log(`Triggered ECS Task for ${object.key}`);
                    
                    // IMPORTANT: We no longer delete the message here.
                    // The message deletion is now handled by the transcoder container upon success,
                    // or it will reappear in the queue after visibility timeout if the container fails.
                }
            }
        } catch (error) {
            console.error("Error in consumer loop:", error);
        }
    }
}

init()