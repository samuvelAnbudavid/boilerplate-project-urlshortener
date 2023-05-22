require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns");
const bodyParser = require ('body-parser')
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())
// Basic Configuration
const port = process.env.PORT || 3000;
var data =[];
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', (req, res, next) => {

  const original_url = req.body.url;
  const urlObject = new URL(original_url);

  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      var short_url = Math.floor(Math.random() * 100000).toString();

      data.push({
        original_url: original_url,
        short_url: short_url
      });

      

      res.json({
        original_url: original_url,
        short_url: short_url
      })
    };
  });
});
app.get('/api/shorturl/:id', (req, res)=>{
  let shortnumber =req.params.id

  let redirectURL = data.find((ele)=>ele.short_url == shortnumber)

  res.redirect(redirectURL.original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
