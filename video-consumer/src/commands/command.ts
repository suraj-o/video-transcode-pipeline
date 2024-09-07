import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { ReceiveMessageCommand,DeleteMessageCommand } from "@aws-sdk/client-sqs";


export const queeRecivedCommand= new ReceiveMessageCommand({
    QueueUrl:"https://sqs.ap-south-1.amazonaws.com/099808752074/put-temporary-raw-objects",
    MaxNumberOfMessages:1,
    WaitTimeSeconds:15
})

export function GetDeleteMessageCommand(ReceiptHandle:string){
    return new DeleteMessageCommand({
       QueueUrl:"https://sqs.ap-south-1.amazonaws.com/099808752074/put-temporary-raw-objects",
       ReceiptHandle:ReceiptHandle
   })
}


export function GetTaskCommand(bucket:string,key:string,id:string){
     return new RunTaskCommand({
        cluster:"arn:aws:ecs:ap-south-1:91232132074:cluster/video-trascoder-service",
        taskDefinition:"arn:aws:ecs:ap-south-1:91232132074:task-definition/video-transcoder-task:1",
        launchType:"FARGATE",
        count:1,
        networkConfiguration:{
            awsvpcConfiguration:{
                assignPublicIp:"ENABLED",
                subnets:["subnet-05a24ae36446c94ca", "subnet-0f628dec7cac24ea6", "subnet-017201712e6cf031e"],
                securityGroups:["sg-05f40393184c38a7d"]
            }
        },
        overrides:{
            containerOverrides:[
                {
                    name:"transcoder-image",
                    environment:[
                        {name:"BUCKET_NAME",value:bucket},
                        {name:"KEY",value:key},
                        {name:"ID",value:id}
                    ]
                }
            ]
        }
    })
}