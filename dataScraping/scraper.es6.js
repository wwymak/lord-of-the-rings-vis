/**
 * Script to scrape and parse lord of the rings script hosted
 * at http://www.ageofthering.com/atthemovies/scripts/
 *
 * fellowship of the ring doesn't seem to have scenes 38 & above...
 * also for not quite sure yet but there's an error in parsing scenes 21-24 so the character
 * wasn't all as expected. Manually updated it from MongohHub for now
 *
 * NOTE scraper.js is probably not needed as nodejs supports a lot of the es6 features
 *
 */

var cheerio = require('cheerio'),
    request = require('request'),
    pmongo = require('promised-mongo'),
    $;
require('prototypes');

var dbUrl = 'mongodb://localhost/lordOfTheRingsScript';

var db = pmongo(dbUrl);
var fellowshipCollection = db.collection('fellowship');

var scriptURL = "http://www.ageofthering.com/atthemovies/scripts/fellowshipofthering21to24.php";

function generateScriptUrl(maxScene){
    var items = Math.floor(maxScene/4);
    var urlArr = [];
    for(var i = 1; i< items + 1; i++){
        urlArr.push("http://www.ageofthering.com/atthemovies/scripts/fellowshipofthering"
            + (i * 4 - 3) + "to" + i*4 + ".php")
    }

    return urlArr
}

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
            if(el.includes("Scene") == true && el.includes("~") == true){ //if(el.contains(" \r\nScene") == true){
                //sceneIndices.push({index:i, id: el.split(" ")[2]})
                var parse1 = el.split("Scene");
                parse1.forEach(item => {
                    if(item.includes("~") == true){
                        var temp = item.split("~");
                        var id = +temp[0],
                            sceneName = temp[1]
                        sceneIndices.push({
                            index:i,
                            id,
                            sceneName

                        })
                    }
                })

            }
        });
        var parsed = splitScenes(textArr, sceneIndices);
        console.log(parsed)
        saveToDB(fellowshipCollection, parsed);
    }

}

function saveToDB(collection, parsedScriptObj){
    for(var item in parsedScriptObj){
        if(parsedScriptObj.hasOwnProperty(item)){
            var doc = {
                sceneNumber: +item,
                characters: parsedScriptObj[item],
            }
            collection.insert(doc).then(() => {console.log("inserted")});
        }
    }
}
/**
 * basically this splits the characters from 1 page of html into the scenes
 * (the pages where the script is hosted is in sets of 4 scenes each)
 * @param textArr
 * @param sceneIndexArr
 * @returns {{}}
 */
function splitScenes(textArr, sceneIndexArr){
    var out = {};
    var numberOfScenes = sceneIndexArr.length;
    for(var i = 0; i< numberOfScenes; i++) {
        var temp;
        if(i < numberOfScenes -1){
            temp = textArr.slice((sceneIndexArr[i].index + 1), sceneIndexArr[i+1].index);
        }else {
            temp = textArr.slice(sceneIndexArr[numberOfScenes -1])
        }
        //var temp = textArr.slice((sceneIndexArr[i].index + 1), sceneIndexArr[i+1].index);
        var characterArr = temp.filter(d => d.endsWith(":"))
        out[sceneIndexArr[i].id] = characterArr.map(d => d.split(":")[0].toLowerCase())

    }
    //out[sceneIndexArr[numberOfScenes-1].id] = textArr.slice(sceneIndexArr[numberOfScenes -1]).filter(d => d.endsWith(":"))
    return out;
}

request(scriptURL, parseScript);

var urlArr = generateScriptUrl(40);
urlArr.forEach(url => {
    request(url, parseScript);
})

//console.log(generateScriptUrl(40))
