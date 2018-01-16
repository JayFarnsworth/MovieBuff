var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/scrape/', function(req, res){

url = 'https://www.rottentomatoes.com/celebrity/stanley_kubrick/';

request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var titles = [];
      var ratings = [];
      var years = [];
      var credits1 = [];
      var credits2 = [];
      var credits3 = [];
      var creditsTogether = [];
      var json = [{}];

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      titles[i] = $(this).children().eq(1).children().first().text()
    });

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      ratings[i] = $(this).children().eq(0).children().first().children().eq(1).text()
    });

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      years[i] = $(this).children().eq(4).text()
    });

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      credits1[i] = $(this).find('ul').children().first().children().first().text()
    });

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      credits2[i] = $(this).find('ul').children().eq(1).children().first().text()
    });

    $('#filmographyTbl').find('tbody').find('tr').each(function(i, elem){
      credits3[i] = $(this).find('ul').children().eq(2).children().first().text()
    });
    for (var i = 0; i < credits1.length; i++) {
      creditsTogether.push([]);
      creditsTogether[i].push(credits1[i]);
      if (credits2[i] !== '') {
        creditsTogether[i].push(credits2[i]);
      }
      if (credits3[i] !== '') {
        creditsTogether[i].push(credits3[i]);
      }
    }
    for (var i = 0; i < titles.length; i++) {
      json[i] = {};
      json[i].title = titles[i];
      json[i].year = years[i];
      json[i].rating = ratings[i];
      json[i].credits = creditsTogether[i];
    }
}

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

res.send(json)

    }) ;
})

app.listen('4000')
console.log('Listening on port 4000');
exports = module.exports = app;
