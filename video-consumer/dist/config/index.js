"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecsClient = exports.SqsClient = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const client_ecs_1 = require("@aws-sdk/client-ecs");
exports.SqsClient = new client_sqs_1.SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAROPIQWHFKLSKN5PU",
        secretAccessKey: "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"
    }
});
exports.ecsClient = new client_ecs_1.ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAROPIQWHFKLSKN5PU",
        secretAccessKey: "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"
    }
});
