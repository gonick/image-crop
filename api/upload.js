const { Storage } = require('@google-cloud/storage');

const CLOUD_BUCKET = process.env.GCLOUD_STORAGE_BUCKET_URL;
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
})
const bucket = storage.bucket(CLOUD_BUCKET)

const getPublicUrl = (filename) => {
  return `https://firebasestorage.googleapis.com/v0/b/${CLOUD_BUCKET}/o/${encodeURI(filename)}?alt=media`
}

const sendUploadToGCS = (req, res, next) => {

  if (!req.files) {
    return next()
  }

  let promises = [];
  req.files.forEach((image, index) => {
    const gcsname = image.originalname
    const file = bucket.file(gcsname)

    const promise = new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType: 'image/jpeg'
        }
      });

      stream.on('finish', async () => {
        try {
          req.files[index].cloudStorageObject = gcsname
          await file.makePublic()
          req.files[index].cloudStoragePublicUrl = getPublicUrl(gcsname)
          resolve();
        } catch (error) {
          reject(error)
        }
      });

      stream.on('error', (err) => {
        req.files[index].cloudStorageError = err
        reject(err)
      });

      stream.end(image.buffer);
    })

    promises.push(promise)
  });

  Promise.all(promises)
    .then(_ => {
      promises = [];
      next();
    })
    .catch(next);
}

module.exports.sendUploadToGCS = sendUploadToGCS