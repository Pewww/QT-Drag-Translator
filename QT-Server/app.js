const express = require('express');
const morgan = require('morgan');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
require('dotenv').load();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.listen(3000, () => {
  console.log("Port on");
})


app.post('/api/translation', cors(), (req, res) => {
  console.log(req.header);
  let text = req.body.text;
  let language = req.body.language;
  let transOption = {
    url : 'https://openapi.naver.com/v1/papago/detectLangs',
    form : { 'query' : text },
    headers : {
      'X-Naver-Client-Id': process.env.ID, 
      'X-Naver-Client-Secret': process.env.SECRET
    }
  }
    
  request.post(transOption, (err, response, body) => {
    console.log(JSON.parse(body).langCode);

    let nmtOption = {
      url : 'https://openapi.naver.com/v1/papago/n2mt',
      form : {
        'source': JSON.parse(body).langCode, 
        'target': language,
        'text': text
      },
      headers : {
        'X-Naver-Client-Id': process.env.ID, 
        'X-Naver-Client-Secret': process.env.SECRET
      }
    }

    Nmt(nmtOption)
    .then(body => {
      res.json(body)
    })
    .catch(err => {
      res.json(err);
    });
  });
})

const Nmt = function (NmtOption) {
  return new Promise((resolve, reject) => {
    request.post(NmtOption, (err, response, body) => {
      if (err) {
        reject(err);
      } else{
        console.log(body);
        resolve(JSON.parse(body).message.result);
      }
    });
  });
}