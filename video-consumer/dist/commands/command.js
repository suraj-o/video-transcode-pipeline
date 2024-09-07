"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queeRecivedCommand = void 0;
exports.GetDeleteMessageCommand = GetDeleteMessageCommand;
exports.GetTaskCommand = GetTaskCommand;
const client_ecs_1 = require("@aws-sdk/client-ecs");
const client_sqs_1 = require("@aws-sdk/client-sqs");
exports.queeRecivedCommand = new client_sqs_1.ReceiveMessageCommand({
    QueueUrl: "https://sqs.ap-south-1.amazonaws.com/099808752074/put-temporary-raw-objects",
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 15
});
function GetDeleteMessageCommand(ReceiptHandle) {
    return new client_sqs_1.DeleteMessageCommand({
        QueueUrl: "https://sqs.ap-south-1.amazonaws.com/099808752074/put-temporary-raw-objects",
        ReceiptHandle: ReceiptHandle
    });
}
function GetTaskCommand(bucket, key, id) {
    return new client_ecs_1.RunTaskCommand({
        cluster: "arn:aws:ecs:ap-south-1:099808752074:cluster/video-trascoder-service",
        taskDefinition: "arn:aws:ecs:ap-south-1:099808752074:task-definition/video-transcoder-task:1",
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: ["subnet-05a24ae36446c94ca", "subnet-0f628dec7cac24ea6", "subnet-017201712e6cf031e"],
                securityGroups: ["sg-05f40393184c38a7d"]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: "transcoder-image",
                    environment: [
                        { name: "BUCKET_NAME", value: bucket },
                        { name: "KEY", value: key },
                        { name: "ID", value: id }
                    ]
                }
            ]
        }
    });
}
