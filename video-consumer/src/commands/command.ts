import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";

dotenv.config();

const queueUrl = process.env.SQS_QUEUE_URL || "";

export const queeRecivedCommand = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 15
});

export function GetDeleteMessageCommand(ReceiptHandle: string) {
    return new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: ReceiptHandle
    });
}

export function GetTaskCommand(bucket: string, key: string, id: string, receiptHandle: string) {
    return new RunTaskCommand({
        cluster: process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.ECS_TASK_DEFINITION,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: process.env.ECS_SUBNETS ? process.env.ECS_SUBNETS.split(",") : [],
                securityGroups: process.env.ECS_SECURITY_GROUPS ? process.env.ECS_SECURITY_GROUPS.split(",") : []
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.ECS_CONTAINER_NAME || "transcoder",
                    environment: [
                        { name: "BUCKET_NAME", value: bucket },
                        { name: "KEY", value: key },
                        { name: "ID", value: id },
                        { name: "SQS_RECEIPT_HANDLE", value: receiptHandle },
                        { name: "SQS_QUEUE_URL", value: queueUrl }
                    ]
                }
            ]
        }
    });
}