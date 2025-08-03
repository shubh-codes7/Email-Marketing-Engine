# Email Marketing Platform

A full-stack email marketing platform built with React, Node.js, and MongoDB. This application enables users to create email campaigns, manage contact lists, design email templates, and execute automated email pipelines with advanced queueing and job processing capabilities.

## 🚀 Overview

This email marketing platform leverages modern technologies to provide a robust, scalable solution for email campaign management. The system features:

- **Advanced Queueing System**: Built with **Redis** and **BullMQ** for reliable job processing
- **Background Workers**: Dedicated worker processes for handling email sending tasks
- **AWS SES Integration**: Professional email delivery through Amazon Simple Email Service
- **Job Management**: Robust job queue management with retry mechanisms and error handling
- **Scalable Architecture**: Microservices-based approach with separate worker processes

## ✨ Features

### Core Functionality
- **Contact List Management**: Upload and manage email contact lists via CSV
- **Pipeline Automation**: Create multi-step email campaigns with scheduling
- **Email Verification**: Validate email addresses before sending
- **Bulk Email Sending**: Send emails to large contact lists efficiently

### Technical Features
- **Queue-based Processing**: All email sending is handled through Redis-backed queues
- **Worker Architecture**: Separate worker processes for reliable job execution
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Rate Limiting**: Built-in rate limiting to comply with email service providers
- **Real-time Status**: Track job progress and email delivery status
- **Scalable Design**: Horizontal scaling support for high-volume email campaigns

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **PapaParse** - CSV parsing for contact list uploads

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **AWS SES** - Amazon Simple Email Service for email delivery
- **BullMQ** - Advanced job queue library for Node.js

### Database
- **Redis** - In-memory data structure store for queueing
- **MongoDB** - NoSQL database with Mongoose ODM

### Deployment
- **Frontend** - Vercel ("https://email-marketing-eta.vercel.app/")
- **Backend** - Render ("https://email-marketing-engine.onrender.com")
- **Worker** - Railway 
- **API Testing** - Postman ("https://www.postman.com/uber44/workspace/email-marketing-app")
- **System Design** - Eraser.io ("https://app.eraser.io/workspace/ajB3ASsayJ2AoTqPyayQ?origin=share")


## 📁 Project Structure

```
Email Marketing/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ContactList.jsx
│   │   │   ├── Pipeline.jsx
│   │   │   ├── SendMails.jsx
│   │   │   └── VerifyEmails.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/
│   │   └── db.js         # Database configuration
│   ├── models/           # MongoDB models
│   │   ├── ContactList.model.js
│   │   ├── EmailTemplate.model.js
│   │   └── Pipeline.model.js
│   ├── routes/           # API routes
│   │   ├── contactList.route.js
│   │   ├── mail.route.js
│   │   ├── pipeline.route.js
│   │   └── template.route.js
│   ├── utils/            # Utility functions
│   │   ├── emailQueue.js # BullMQ queue configuration
│   │   └── sendBulkMail.js # AWS SES integration
│   ├── worker.js         # Background worker process
│   └── index.js          # Main server file
└── README.md
```


## 📊 API Endpoints

### Templates
- `GET /template` - Get all templates
- `POST /template` - Create new template

### Contact Lists
- `GET /contact` - Get all contact lists
- `POST /contact` - Upload contact list

### Pipelines
- `GET /pipeline` - Get all pipelines
- `POST /pipeline` - Create new pipeline

### Mail Operations
- `POST /mail/send` - Send bulk emails
- `POST /mail/verify` - Verify email addresses

## 🔒 Environment Variables

### Required Server Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `AWS_REGION`: AWS region for SES
- `AWS_ACCESS_KEY`: AWS access key ID
- `AWS_SECRET_KEY`: AWS secret access key
- `AWS_SENDER_MAIL`: Verified SES sender email
- `CLIENT_URL`: Frontend URL for CORS

---

**Built with ❤️ using React, Node.js, MongoDB, Redis, BullMQ, and AWS SES**
