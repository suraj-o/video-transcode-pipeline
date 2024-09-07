import { SQSClient } from "@aws-sdk/client-sqs";
import {ECSClient} from "@aws-sdk/client-ecs"

export const SqsClient= new SQSClient({
    region:"ap-south-1",
    credentials:{
        accessKeyId:"",
        secretAccessKey:""
    }
})

export const ecsClient = new ECSClient({
    region:"ap-south-1",
    credentials:{
        accessKeyId:"",
        secretAccessKey:""
    }
})