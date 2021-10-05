import express, { Handler } from 'express'
import debug from 'debug'
import fileUpload from 'express-fileupload'
import path from 'path'

const app = express()
const bug = debug('log')

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

const Upload: Handler = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send('No files were uploaded.')

  const sampleFile: fileUpload.UploadedFile | fileUpload.UploadedFile[] =
    Array.isArray(req.files.sampleFile)
      ? req.files.sampleFile
      : [req.files.sampleFile]

  sampleFile.forEach((file) => {
    const uploadPath = path.join(__dirname, '/files', file.name)

    file.mv(uploadPath, (err) => {
      if (err) return res.status(500).send(err)
    })
  })
  res.send('File uploaded!')
}
const UploadPage: Handler = (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
}
app.get('/', UploadPage)
app.post('/upload', Upload)

app.listen(3000, '0.0.0.0', () => {
  bug('server up')
})
