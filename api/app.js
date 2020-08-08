require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const port = process.env.API_PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('Welcome to this file upload API :)'));

// Create new storage instance with Firebase project credentials
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

// Create a bucket associated to Firebase storage bucket
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});
const sendUploadToGcs = require('./upload.js').sendUploadToGCS;

// Upload endpoint to send file to storage bucket
app.post('/api/upload', uploader.array('image'), sendUploadToGcs, (req, res, next) => {

  res.status(200).json({ files: req.files });

});

app.get('/api/images', async (req, res) => {
  const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL)
  const [files] = await bucket.getFiles();
  const response = files.map(file=>({name:file.metadata.name,url:file.metadata.mediaLink}));
  res.status(200).json(response);
})

app.listen(port, () =>
  console.log(`File uploader API listening on port ${port}`)
);