const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded())

app.use((req, res, next) => {
  console.log('serving request:', req.method, req.url, req.params)
  next()
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/images', (req, res) => {
  const dirs = fs.readdirSync(path.join(__dirname, 'public/images'));
  res.status(200).send(dirs)
})

app.get('/image/:image_label', (req, res) => {
  const { image_label } = req.params
  console.log(req.params);
  res.status(200).sendFile(path.join(__dirname, `public/images/${image_label}/${image_label}.jpg`))
})


app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ', process.env.PORT || 3000)
})