/**
 * Created by wwymak on 10/01/2016.
 */
var pmongo = require('promised-mongo');
//var database = require('../config/database');
//
//var db = pmongo(database);

var dbUrl = 'mongodb://localhost/lordOfTheRingsScript';

var db = pmongo(dbUrl);

var fellowshipCollection = db.collection('fellowship');
var charactersCollection = db.collection('characters');

var characters = ["elrond"]
console.log(characters[0])

//fellowshipCollection.find({characters: {$in:[ characters[0]]}})
//    .forEach(doc =>{
//        var char = characters[0]
//        var out = {};
//        out.sceneNumber = doc.sceneNumber;
//        out.charcName = char;
//        var count = 0
//        for(var item of doc.characters){
//            if (item == char){
//                count ++;
//            }
//        }
//        out.occurence = count
//        console.log(out);
//        return out
//    }).then(function(data){
//    console.log('done', data)
//});

// counting how many times a character occurs in a scene
fellowshipCollection.find({characters: {$in:[ characters[0]]}}).toArray()
    .then(docs => {
        var char = characters[0];
        var outDoc = {
            charName: char,
            sceneArr: []
        };
        console.log(docs[0], outDoc);
        docs.forEach(doc => {
            //console.l
            var out = {};
            out.sceneNumber = doc.sceneNumber;
            var count = 0
            for(var item of doc.characters){
                if (item == char){
                    count ++;
                }
            }
            out.occurence = count;
            console.log(out);
            outDoc.sceneArr.push(out)
        });

        charactersCollection.insert(outDoc)

    })