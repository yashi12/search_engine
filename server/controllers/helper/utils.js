const AWS = require("aws-sdk");
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

const params = {
    Bucket: "connect-dev-image"
  }
  const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
    console.log("hi")
    s3.listObjectsV2(params).promise()
      .then(({Contents, IsTruncated, NextContinuationToken}) => {
        out.push(...Contents);
        console.log("content:",Contents);
        !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
        return out;
      })
      .catch(reject);
  });

  const listS3Objects = async () => {
    // try {
    //   // const response = await s3.listObjectsV2({
    //   //   Bucket: "aurealbucket"
    //   // }).promise();
    //   const response = await s3.listObjectsV2({
    //     Bucket: "aurealbucket"
    //   }, function (err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     // else     console.log(data);           // successful response
    //     data = {
    //       Contents: [],
    //       IsTruncated: false,
    //       KeyCount: KeyCount,
    //       MaxKeys: MaxKeys,
    //       NextContinuationToken: NextContinuationToken,
    //       Prefix: ""
    //     }
    //   });
    //   console.log(response);
    //   return response;
    // } catch (e) {
    //   console.log(e);
    // }
    const out = await listAllKeys(params);
    out.map(Content=>{
      fs.appendFile('rss.txt',`content: ${Content.Key} `+ '\n',err=>{
        if(err)
            console.log(err);
    });
    })
   
    return out;

  };

listS3Objects();

//   module.exports = {
//     listS3Objects: listS3Objects,

// }