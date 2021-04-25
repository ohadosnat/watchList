const container = document.querySelector('#filmWrapper');


const watchlist = 'watchlist.json'

const myList = new siteUI(container);
const myWatchlist = new Watchlist(watchlist);
const newData = new APIdata();



// myWatchlist.getLocalJSON()
//     .then((data) => myWatchlist.jsonToFirestore(data))
//     .catch(err => console.log(err));

// Renders Data - While working on the design, turn this off
myWatchlist.getCollection(data => {
    newData.getFilm(data)
        .then((result) => myList.render(result))
        .catch(err => console.log(err))
});

// EventListeners (Hover/Click)
container.addEventListener('mouseenter', (e) => {
    const boxImg = e.target.previousElementSibling
    const watchToggle = e.target.lastElementChild
    if (e.target.id === "overlay") {
        boxImg.classList.add('transform');
        watchToggle.classList.remove('hidden')
        watchToggle.classList.add('flex')
        setTimeout(() => watchToggle.classList.remove('opacity-0'), 10);
    }
}, true);

container.addEventListener('mouseleave', (e) => {
    const boxImg = e.target.previousElementSibling
    const watchToggle = e.target.lastElementChild
    const filmID = myList.films.find(film => film.id === e.target.parentElement.id)
    if (e.target.id === "overlay") {
        boxImg.classList.remove('transform');
        if (filmID.watchStatus === false) {
            watchToggle.classList.add('opacity-0');
            setTimeout(() => {
                watchToggle.classList.remove('flex');
                watchToggle.classList.add('hidden');
            }, 300)
        }
    }
}, true);


container.addEventListener('click', e => {
    const filmID = myList.films.find(film => film.id === e.target.parentElement.parentElement.id)
    if (e.target.id === "watchToggle") {
        if (filmID.watchStatus) {
            e.target.classList.replace('bg-watched', 'bg-didntWatch')
            filmID.watchStatus = false
            myWatchlist.updateStatus(filmID)

        } else {
            e.target.classList.replace('bg-didntWatch', 'bg-watched')
            filmID.watchStatus = true
            myWatchlist.updateStatus(filmID)
        }
    }
}, true)