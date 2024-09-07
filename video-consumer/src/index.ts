import { S3Event } from "aws-lambda";
import { GetDeleteMessageCommand, GetTaskCommand, queeRecivedCommand } from "./commands/command";
import { ecsClient, SqsClient } from "./config";
import {v4} from "uuid"


async function init (){
    while(true){
        const {Messages} =await SqsClient.send(queeRecivedCommand);
        if(!Messages){
            console.log("no messages")
            continue;
        }

        try {
            for(const message of Messages){
                const {Body} = message;    
                if(!Body) continue;
    
                const event = JSON.parse(Body) as S3Event;
                if("Service" in event && "Event" in event){
                    if(event.Event=== "s3:TestEvent") continue;
                }
    
                for(const record of event.Records){
                    const {s3:{ bucket, object }} = record;
                    const taskCommand = GetTaskCommand(bucket.name,object.key,v4())
                    const deleteQueeMessageCommand= GetDeleteMessageCommand(message.ReceiptHandle!)
                    
                    // spin a ecs task
                    await ecsClient.send(taskCommand)
                    
                    // delete the message which is used in this process
                    await SqsClient.send(deleteQueeMessageCommand)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}
init()