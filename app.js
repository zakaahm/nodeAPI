const express = require('express');
const app= express();
const https = require('https');
const fetch = require('node-fetch');
const cors = require('cors');



var api = "https://quran-endpoint.vercel.app/quran";
var originsWhitelist =['http://localhost:4200'];

//CORS

var corsOptions= {

  origin: function(origin, callback){
    var isWhitelisted= originsWhitelist.indexOf(origin) !==1;
    callback(null, isWhitelisted);
  },
  
  credentials: true,
}
app.use(cors(corsOptions));

app.get('/chapters' , (req, res) => {
    
fetch(api).then(response => response.json()).then(data => {
    
    console.log(data)

    var chapterData =[ ]
    data.data.forEach(element => {
        chapterData.push(
            {
              "number": element.number,
              "ar":element.asma.ar.short,
              "en":element.asma.en.short
            }
          )
    });
    
    res.json(chapterData)
  }).catch(err => console.log(err))
  
})

app.get('/surah/:id' ,  (req, res) => {
  var surah = new URL(`https://quran-endpoint.vercel.app/quran/${req.params.id}`) ;
  
  fetch(surah).then(response => response.json()).then(data => {
  
   
    var dataFromChapter = {

          "number": data.data.number,
          "arabicName" : data.data.asma.ar.short ,
          "englishName" : data.data.asma.en.short,
          "verses": []
      }

      data.data.ayahs.forEach(element => {

        dataFromChapter.verses.push({

          "arText": element.text.ar,
          "text": element.text.read,
          "audio" : element.audio.url

        })

      })
      
     // console.log(data.data.number)
      res.json(dataFromChapter)

    }).catch(err => console.log(err))
    
  })
  

  app.listen(3000 , (req, res) => {

    console.log("Express is running");

})