FIX ANY TYPOS, GRAMMAR AND SUCH LATER
# Watchlist Project
### Using **Firebase(Firestore), Vanilla JS, CSS & HTML**
As always, as I'm learning new things, I try working on my own ideas to get better understanding of the concepts I've learned and discover new ones. <br>
This time, it was building a project with Firestore's Firebase. <br> <br>
You can view the project [here](https://link) <br>

## The Idea
I'm a long time user of the site "Letterboxd" which is a social network for films/tv shows lovers (like IMDB but more elegant I would say). <br>
The day I started learning Firestore, I was looking through my watchlist and notice that I can export it into a CSV, and from this moment, I knew what my Firestore project is going to be! <br>

## The Process
Fast forward a few days, I exported my watchlist. Turned it into JSON, and faced my first problem ***"How do I import my JSON data into Firestore"***, and after reading that I can't, I got excited and started to write my own functions that will automatily add all of my JSON items into Firestore in the right format & will check if it already exisits to avoid duplications. <br>

    Quick info about it: basicaly it was a simple for loop that generates a unique id, converts the date into firestore's timestamp format, and creates an object that takes all the data. After that, It grabs the collection and checks if the document exists(by id), if it doesn't then it will be added!

After getting my JSON data into Firestore I started to work on grabbing the documents and passing them into **The Movie Database's API** <br>

-THIS README.md IS STILL A WORKING DRAFT