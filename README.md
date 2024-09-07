<div align="center">

<div>
    <img src="https://img.shields.io/badge/-javascript-black?style=for-the-badge&logoColor=white&logo=javascript&color=f5e942" alt="typescript" />
    <img src="https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=3178C6"alt="tailwindcss" />
    <img src="https://img.shields.io/badge/AWS-grey?style=for-the-badge&logo=aws" alt="tailwind" />
  </div>

<h3 align="center">Video Transcoding System</h3>

</div>  

***Overview***
The Video Transcoding System is a robust and scalable solution designed for efficient video processing, 
utilizing a stack of modern technologies including Node.js, Docker, AWS S3, AWS SQS, Express.js, and FFmpeg. 
This system is tailored to handle video transcoding tasks, converting videos from one format to another to meet various quality and compatibility requirements.
The integration of these technologies ensures a high-performance, reliable, and flexible system suitable for a range of applications

## <a name="tech-stack">⚙️ Tech Stack</a>
- Next.js
- Node JS
- Express Js
- Docker
- AWS

## <a name="features">🔋 Features</a>

👉 **Scalability**: The system is designed to handle a large volume of video transcoding requests by leveraging AWS SQS for queuing and Docker for containerization.

👉 **Flexibility**: Supports multiple video formats, allowing users to convert videos to meet specific requirements.

👉 **Reliability**: Utilizes AWS S3 for durable and highly available storage of video files and FFmpeg for reliable video processing.

👉 **API Integration**: Provides RESTful API endpoints through Express.js for easy integration with other services and applications.

👉 **FFmpeg**: Powerful multimedia framework used for video and audio processing, including transcoding, format conversion, and quality adjustments.


## <a name="quick-start">🤸 Quick Start Locally</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

- [Node. js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Docker](https://docker.com/)
- [AWS](https://aws.amazon.com/)

**Cloning the Repository**

```bash or PowerShell
git clone https://github.com/suraj-o/https://github.com/suraj-o/video-transcode-pipeline
cd video-transcode-pipeline
```

**First of all start server**

**NOTE**: change aws with your credentials  

```bash
---you must change credentials given following fields below---

--AWS--
video-consumer/src/config/index:4
video-consumer/src/config/index:12
AWS-transcoder-builder/index:21

--change task configuration--
video-consumer/src/commands/command.ts
```


**Installation**

**video-consumer**
```bash
---Install the project dependencies using npm:---

cd video-consume
npm install

npm run dev
```

**main-server**
```bash
---run following command---
cd main-server
npm install

npm start

```

**Now pipeline get started**


