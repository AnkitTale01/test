const aws = require("aws-sdk");
require('dotenv').config();


aws.config.update({
    accessKeyId: process.env.aws_accessKeyId,
    secretAccessKey: process.env.aws_secretAccessKey,
    region: "ap-southeast-2"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "shadi-app",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}

let deleteImage=async (filename) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var deleteParams = {
            Bucket: "shadi-app",
            Key: "abc/" + filename,
            }


        s3.deleteObject(deleteParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            // console.log(data)
            console.log("File has been deleted successfully")
            return resolve(data.Location)
        })
    })
}
module.exports = {uploadFile,deleteImage}