const express = require('express');
const path = require('path')

const app = express();

app.use(express.urlencoded())

app.use((req, res, next) => {
  console.log('serving request:', req.method, req.url, req.query)
  next()
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ', process.env.PORT || 3000)
})