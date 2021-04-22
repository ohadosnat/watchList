const section = document.querySelector('section');
const boxContent = document.querySelectorAll('#boxContent')
const watchToggle = document.querySelectorAll('#watchToggle')

const watchlist = 'watchlist.json'
const boxImg = boxContent.firstElementChild;

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
});



// EventListeners (Hover/Click)

// Watch Status Toggle - Hover Animation
boxContent.onmouseenter = function () {
    watchToggle.classList.remove('hidden')
    watchToggle.classList.add('flex')
    setTimeout(() => watchToggle.classList.remove('opacity-0'), 10);
    boxImg.classList.add('transform');

}
boxContent.onmouseleave = function () {
    watchToggle.classList.add('opacity-0');
    setTimeout(() => {
        watchToggle.classList.remove('flex');
        watchToggle.classList.add('hidden');
    }, 300)
    boxImg.classList.remove('transform');
}


// Add more functionality to it - make sure it got add/remove from Database
const Watchstatus = {
    watched: "./css/icons/ic_eye-watched.svg",
    didntWatch: "./css/icons/ic_eye-empty.svg",
    state: false
}
watchToggle.addEventListener('click', () => {
    if (Watchstatus.state) {
        watchToggle.firstElementChild.src = Watchstatus.didntWatch;
        Watchstatus.state = false
    } else {
        watchToggle.firstElementChild.src = Watchstatus.watched;
        Watchstatus.state = true
    }
})