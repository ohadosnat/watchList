const siteList = document.querySelector('ul');

const watchlist = 'watchlist.json'

const myList = new siteUI(siteList);
const myWatchlist = new Watchlist(watchlist);
const newData = new APIdata();

// newData.getAPI()
//     .then(data => newData.getPoster(data))
//     .catch(err => console.log(err));
// myWatchlist.getLocalJSON()
//     .then((data) => myWatchlist.jsonToFirestore(data))
//     .catch(err => console.log(err));
myWatchlist.getCollection(data => {
    newData.getFilm(data)
        .then(result => myList.render(result))
});