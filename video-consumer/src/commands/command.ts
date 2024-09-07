import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { ReceiveMessageCommand,DeleteMessageCommand } from "@aws-sdk/client-sqs";


export const queeRecivedCommand= new ReceiveMessageCommand({
    QueueUrl:"https://sqs.us-east-1.amazonaws.com",
    MaxNumberOfMessages:1,
    WaitTimeSeconds:15
})

export function GetDeleteMessageCommand(ReceiptHandle:string){
    return new DeleteMessageCommand({
        QueueUrl:"https://sqs.us-east-1.amazonaws.com",
       ReceiptHandle:ReceiptHandle
   })
}


export function GetTaskCommand(bucket:string,key:string,id:string){
     return new RunTaskCommand({
        cluster:"https://sqs.us-east-1.amazonaws.com",
        taskDefinition:"https://sqs.us-east-1.amazonaws.com",
        launchType:"FARGATE",
        count:1,
        networkConfiguration:{
            awsvpcConfiguration:{
                assignPublicIp:"ENABLED",
                subnets:["https://sqs.us-east-1.amazonaws.com", "https://sqs.us-east-1.amazonaws.com", "https://sqs.us-east-1.amazonaws.com"],
                securityGroups:["https://sqs.us-east-1.amazonaws.com"]
            }
        },
        overrides:{
            containerOverrides:[
                {
                    name:"https://sqs.us-east-1.amazonaws.com",
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