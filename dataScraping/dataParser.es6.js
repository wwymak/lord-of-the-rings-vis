/**
 * Created by wwymak on 10/01/2016.
 */
var pmongo = require('promised-mongo');
var dbUrl = 'mongodb://localhost/lordOfTheRingsScript';
var db = pmongo(dbUrl);
var fellowshipCollection = db.collection('fellowship');
var charactersCollection = db.collection('characters_fellowship');

var fellowshipCharData = require('../data/fellowship_characters').fellowshipCharacters;


var count = 0;
//for(var char of fellowshipCharData){
//    console.log(char)
//    characterOccurenceParser(char);
//}


// counting how many times a character occurs in a scene

function characterOccurenceParser(character){
    fellowshipCollection.find({characters: {$in:[ character]}}).toArray()
        .then(docs => {
            var char = character;
            var outDoc = {
                charName: char,
                sceneArr: []
            };
            docs.forEach(doc => {
                var out = {};
                out.sceneNumber = doc.sceneNumber;
                var count = 0;
                for(var item of doc.characters){
                    if (item == char){
                        count ++;
                    }
                }
                out.occurence = count;
                outDoc.sceneArr.push(out)
            });

            charactersCollection.insert(outDoc)
            count ++;
            if(count == fellowshipCharData.length){
                console.log('done')
            }

        })
}

function characterMapping(character, dataOutObj){
    var allSceneArr = Array.apply(null, new Array(37)).map(d => {return 0});
    charactersCollection.find({charName: { $eq:  character}}).toArray()
        .then(docs => {
            docs.forEach(doc => {
                var scene = doc.sceneArr
                scene.forEach(d => {
                    var index = d.sceneNumber,
                        occurence = d.occurence;
                    allSceneArr[index -1] = occurence
                });

                console.log(allSceneArr);
                dataOutObj[character] = allSceneArr;

                count++;
                console.log(count, dataOutObj)
            })

        });

};

//var charactersOfInterest = ["frodo", "sam", "legolas", "gimli", "pippin", "merry", "gandalf"];

var charactersOfInterest = ["boromir"]

var dataOut = {};

charactersOfInterest.forEach(person => {
    characterMapping(person, dataOut)
});


