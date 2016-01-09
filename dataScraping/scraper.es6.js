/**
 * Created by wwymak on 09/01/2016.
 */

var cheerio = require('cheerio'),
    request = require('request'),
    $;
require('prototypes');

var scriptURL = "http://www.ageofthering.com/atthemovies/scripts/fellowshipofthering1to4.php";

function parseScript(err, resp, html){
    if(err){
        console.log(error);
        return
    }
    if (resp.statusCode == 200) {
        $ = cheerio.load(html);
        var tempArr = $('td').filter(function (i, el) {
            return $(el).attr("valign") == "top";
        });
        var textArr = [];
        tempArr.each(function (i, el) {
            textArr.push($(el).text());
        });
        var sceneIndices = [];
        textArr.forEach((el, i) => {
            if(el.startsWith(" \r\nScene") == true){
                sceneIndices.push(i)
            }
        });

        var parsed = splitScenes(textArr, sceneIndices);
        console.log(parsed)
    }

}

function splitScenes(textArr, sceneIndexArr){
    var out = {}
    for(var i = 0; i< sceneIndexArr.length; i++) {
        var temp = textArr.slice((sceneIndexArr[i] + 1), sceneIndexArr[i+1]);

        out[i] = temp.filter(d => d.endsWith(":"))

    }
    return out;
}

request(scriptURL, parseScript);
