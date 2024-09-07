// importing require modules
const {S3Client,GetObjectCommand,PutObjectCommand} = require("@aws-sdk/client-s3")
const fs = require("node:fs/promises")
const fs2 = require("node:fs")
const path = require("path")
const ffmpeg = require("fluent-ffmpeg")

// ENV VARIABLES
const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY
const ID= process.env.ID

// CONSTANT VARIABLES/VALUES
const resuolution=[
    {name:"360p", widht:480, height:360},
    {name:"480p", widht:858, height:480},
    {name:"720p", widht:1280, height:720},
    {name:"1080p", widht:1920, height:1080},
]

const s3Client = new S3Client({
    region:"ap-south-1",
    credentials:{
        accessKeyId:"AKIAROPIQWHFKLSKN5PU",
        secretAccessKey:"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"
    }
})

// MAIN EXECUTION
async function initProcess(){
    const getCommand= new GetObjectCommand({
        Bucket:BUCKET_NAME,
        Key:KEY
    });

    const {Body} = await s3Client.send(getCommand);
    const dataStoresPath = "video-raw-video.mp4";

    await fs.writeFile(dataStoresPath,Body);
    const rawVideoPath= path.resolve(dataStoresPath);


    const ffmpegPromises = resuolution.map(resuolution=>{
        const outputs = `video-${resuolution.name}.mp4`

        return new Promise((resolve)=>{
            ffmpeg(rawVideoPath)
            .output(outputs)
            .videoCodec("libx264")
            .withAudioCodec("aac")
            .withSize(`${resuolution.widht}x${resuolution.height}`)
            .format("mp4")
            .on("start",()=>console.log(`${resuolution.name} started`))
            .on("end",async()=>{
                const putCommand = new PutObjectCommand({
                    Bucket:"final-output-prod",
                    Key:`${ID}/${outputs}`,
                    Body:fs2.createReadStream(path.resolve(outputs))
                })
                console.log("exrcuting command")
                await s3Client.send(putCommand)
                console.log(`done`)
                resolve()
            })
            .run()
        })
    })

    await Promise.all(ffmpegPromises)
}

initProcess().finally(()=>process.exit(0))