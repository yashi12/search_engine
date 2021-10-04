const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const removeMedia = (post)=>{
    if (post && post.media) {
        let decodedUrl = decodeURIComponent(post.media)
        const message = decodedUrl.split('amazonaws.com/')[1]
        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: message
        };
        s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
        });
    }
}

module.exports = {
    removeMedia: removeMedia
}
