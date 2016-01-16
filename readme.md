Basically I want to do something like http://evelinag.com/blog/2015/12-15-star-wars-social-network/ 
and http://www.martingrandjean.ch/network-visualization-shakespeare/ but with lord of the rings movies. 
Found an easy to parse version of the script at http://www.ageofthering.com/atthemovies/scripts/
so using that at the moment

ideas/questions:

- network connections between characters
- character occurence
- potentially at some point compare movie with the books...?
(possibly from http://www.ae-lib.org.ua/texts-c/tolkien__the_lord_of_the_rings_1__en.htm)
- scenes with only 1 character?
- are there many scenes with lots of voice overs?

Notes on db queries

Getting the characters in the 1st movie :
`db.runCommand({distinct: "fellowship", key: "characters"})`

gives:

<pre><code>

{
	"values" : [
		"orc",
		"saruman",
		"sauron voice",
		"bilbo",
		"gandalf",
		"bilbo's voice",
		"frodo",
		"elrond",
		"sam",
		"gaffer",
		"hobbit",
		"merry and pippin",
		"noakes",
		"pippin",
		"rosie",
		"sandyman",
		"bilbo voice",
		"gollum's voice",
		"aragorn",
		"boromir",
		"gandalf voiceover",
		"gimli",
		"legolas",
		"merry",
		"saruman voiceover",
		"arwen",
		"arwen voice",
		"strider",
		"wraith",
		"galadriel",
		"galadriel voice over",
		"gollum",
		"bilbo voiceover",
		"children hobbits",
		"voice",
		"elrond in the background",
		"galadriel voice-over",
		"haldir",
		"frodo voice",
		"farmer maggot",
		"barliman",
		"gatekeeper",
		"gatekeepr",
		"man",
		"men",
		"ring",
		"crowd",
		"mrs bracegirdle",
		"proudfoot hobbit",
		"black rider",
		"gandalf reading ",
		"gollum voice",
		"saruman voice",
		"elrond voiceover",
		"isildur"
	]

</code></pre>

or for a specific scene:
`db.runCommand({distinct: "fellowship", key: "characters", query: {sceneNumber:1}})`
<pre>
```"values" : [
   		"bilbo",
   		"elrond",
   		"galadriel",
   		"galadriel voice over",
   		"gollum"
   	],```
   	</pre>
   	
`db.find({characters: {$in:[ "elrond"]}})` for all the docs that has elrond as a character