const section = document.querySelector('section');


const watchlist = 'watchlist.json'

const myList = new siteUI(section);
const myWatchlist = new Watchlist(watchlist);
const newData = new APIdata();


// newData.getAPI()
//     .then(data => newData.getPoster(data))
//     .catch(err => console.log(err));
// myWatchlist.getLocalJSON()
//     .then((data) => myWatchlist.jsonToFirestore(data))
//     .catch(err => console.log(err));

// Renders Data - While working on the design, turn this off (comment)
myWatchlist.getCollection(data => {
    newData.getFilm(data)
        .then(result => myList.render(result))
        .catch(err => console.log(err))
});
