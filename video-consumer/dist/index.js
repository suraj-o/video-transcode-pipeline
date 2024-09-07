"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./commands/command");
const config_1 = require("./config");
const uuid_1 = require("uuid");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            const { Messages } = yield config_1.SqsClient.send(command_1.queeRecivedCommand);
            if (!Messages) {
                console.log("no messages");
                continue;
            }
            try {
                for (const message of Messages) {
                    const { Body } = message;
                    if (!Body)
                        continue;
                    const event = JSON.parse(Body);
                    if ("Service" in event && "Event" in event) {
                        if (event.Event === "s3:TestEvent")
                            continue;
                    }
                    for (const record of event.Records) {
                        const { s3: { bucket, object } } = record;
                        const taskCommand = (0, command_1.GetTaskCommand)(bucket.name, object.key, (0, uuid_1.v4)());
                        const deleteQueeMessageCommand = (0, command_1.GetDeleteMessageCommand)(message.ReceiptHandle);
                        // spin a ecs task
                        yield config_1.ecsClient.send(taskCommand);
                        // delete the message which is used in this process
                        yield config_1.SqsClient.send(deleteQueeMessageCommand);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
init();
