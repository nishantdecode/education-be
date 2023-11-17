const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Set up AWS credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Upload a file to S3
exports.uploadFile = async (bucketName, key,fileContent) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
    };
    const response=await s3.upload(params).promise();
    return response;
};

// Download a file from S3
exports.downloadFile = async (bucketName, key, filePath) => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };
    const response = await s3.getObject(params).promise();
    fs.writeFileSync(filePath, response.Body);
};

// Delete a file from S3
exports.deleteFile = async (bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };
    console.log(bucketName);
    console.log(key);
    const response= await s3.deleteObject(params).promise();
    return response;
};

// Update an object in S3
exports.updateFile = async (bucketName, key,fileContent) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
    };
    const response=await s3.upload(params).promise();
    return response;
};
