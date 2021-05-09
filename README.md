# Watchlist Project
### Using **Firebase(Firestore), Vanilla JS, CSS & HTML**
As always, as I'm learning new things, I try working on my ideas to get a better understanding of the concepts I've learned and discover new ones.
This time, it was building a project with Firestore's Firebase. <br> <br>
You can view the project [here](https://ohadosnat.github.io/watchList/index.html) <br>

## The Idea
I'm a long time user of the site "Letterboxd" which is a social network for film/tv show lovers (like IMDB but more elegant I would say). <br>
The day I started learning Firestore, I was looking through my watchlist and noticed that I can export it into a CSV, and from that moment, I knew what my Firestore project is going to be!
 <br>

## The Process
Fast forward a few days, I exported my watchlist. Turned it into JSON, and faced my first problem ***"How do I import my JSON data into Firestore"***, and after reading that I can't, I got excited and started to write functions that will automatically add all of my JSON items into Firestore in the right format & will check if it already exists to avoid duplications.
 - Quick info about it: it was a simple "for loop" that generates a unique id, converts the date into firestore's timestamp format, and creates an object that takes all the data. After that, It grabs the collection and checks if the document exists(by id), if it doesn't then it will be added!

After getting my JSON data into Firestore, I started to work on grabbing the documents and passing them into **The Movie Database's API** (which I'll be using to get the film's/tv show's info)<br>
I managed to get the API working, and after  passing only a few films to it from the Firestore database I saw that it worked, and moved to the design part.

## The Design
As usual, I opened up Figma, and started to design my project. My first idea was to use one of my designs from my [Tailwind Collection Project](https://github.com/ohadosnat/tailwind-collection) which is a "[movie app](https://ohadosnat.github.io/tailwind-collection/pages/movie.html)" type design. I started to think how the watchlist of my "movie app" design would look, and from there it was pretty fast. <br>
I thought about more features such as adding/removing entries and displaying the entry's title & runtime.<br>
Of course, as I continued to work on this project, new ideas came up and I always ended up changing things. <br>
Back to the development process, I started to work on the design using Tailwind CSS (again).

### **From the development process was:**
- Making sure the entries info is correct (runtime/title), and displaying it properly.
- Updating the watchlist status (watched/didn't watch), and making sure it is also being updated in Firestore.
- Adding new entries, and matching the entry's title & type (movie/tv) to the right result.
- At first, I took the first result the API gives, as I assumed it would be the most popular one, but after searching *"Fist of Fury"* (while showing my project to my dad), It got me the wrong film.
    - Luckily, one of the properties each result has is "popularity", So I made a simple function that compares all the results' popularities, and returns the result with the highest popularity.
- Removing entries: entering/exiting edit mode and making sure it gets updated if the user deletes an entry in Firestore.
- Messages: when a user updates the entry's watch status/adds a new entry/removes an entry, a message will appear that feedback the user about what happened. Also during "edit mode", a small message box appears on the screen so the user will know where he is and how to exit.
- Infinite Scroll - This was one of the last things I did, since all the time I worked with 2-7 entries.
    - My current collection got more than 200 documents, and displaying all of them at once, is a bad idea.
    - I wanted to have infinite scroll pagination, which wasn't hard to achieve but a bit annoying
    - For most of my development, I used `.onSnapshot()` to get real-time updates (add/remove) from my collection, but it doesn't work well with pagination that well. so I had to re-write my functions, and use the normal `.get()` and save the last document index, so when the scroll event happens, It will start from there (I used `.startAfter(location)`).

Overall, this was a fun project and a long one (longer than I expected), I learned many new things, how to use different concepts together, debugging and figuring out what went wrong.
<br><br>

## Future Ideas
I want to continue to work on this project and implement more features such as:
- User Authentication.
- Watch Link: if the movie is available online (Netflix/AppleTV/Amazon), then link it and allow users to save time searching it in their streaming service and more.
- Ratings.
<br><br>
----
***As always, If you got any suggestions/feedback/tips about my code. Feel free to reach out and help me learn!*** 😄 <br>
That's all for today! See you next time!
