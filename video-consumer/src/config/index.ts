import { SQSClient } from "@aws-sdk/client-sqs";
import {ECSClient} from "@aws-sdk/client-ecs"

export const SqsClient= new SQSClient({
    region:"ap-south-1",
    credentials:{
        accessKeyId:"AKIARKN5PU",
        secretAccessKey:"qxMobT90i5n2/FaN4RxF0"
    }
})

export const ecsClient = new ECSClient({
    region:"ap-south-1",
    credentials:{
        accessKeyId:"AKIAROPIQWHFKLSKN5PU",
        secretAccessKey:"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"
    }
})