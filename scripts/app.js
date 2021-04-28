const container = document.querySelector('#filmWrapper');
const updateMessage = document.querySelector('#updateMessage');
const section = container.parentElement;


const watchlist = 'watchlist.json'

const myList = new siteUI(container);
const myWatchlist = new Watchlist(watchlist);
const newData = new APIdata();

// Screen Queries
const screenQueries = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
}


// Pushing JSON data to Firestore
// myWatchlist.getLocalJSON()
//     .then((data) => myWatchlist.jsonToFirestore(data))
//     .catch(err => console.log(err));

// Renders Data - While working on the design, turn this off
// myWatchlist.getCollection(data => {
//     newData.getFilm(data)
//         .then((result) => myList.render(result))
//         .catch(err => console.log(err))
// })
myWatchlist.getDocuments(data => {
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
    const filmID = myList.films.find(film => film.id === e.target.parentElement.parentElement.id);
    if (e.target.id === "watchToggle") {
        if (filmID.watchStatus) {
            e.target.classList.replace('bg-watched', 'bg-didntWatch')
            filmID.watchStatus = false
            myWatchlist.updateStatus(filmID)
        } else {
            e.target.classList.replace('bg-didntWatch', 'bg-watched')
            filmID.watchStatus = true
            myWatchlist.updateStatus(filmID)
        };
    };
}, true);

//  Add new Entry
container.addEventListener('click', (e) => {
    if (e.target.id === "addCard" || e.target.parentElement.id === "addCard") {
        if (container.children[1].id === "addForm") {
            container.removeChild(container.children[1])
        }
        addCard.insertAdjacentHTML('afterEnd', `
        <form id="addForm" action="" autocomplete="off"
        class="relative global-transition pb-4 px-2 flex justify-center items-center flex-col h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52 border-white border-2 text-white">
        <input type="text" id="entryTitle" required
        class="w-full text-sm bg-transparent border-white border-b text-center pb-1 placeholder-current"
        placeholder="Enter a Film/TV Show Title">
        <button type="submit" class="absolute bottom-0 bg-white shadow-sm text-black w-full py-1">Add Entry</button>
        <div class="flex items-center justify-center mt-3">
        <input type="radio" name="type" id="movie" value="movie" class="mr-1" required>
        <label for="movie" class="mr-5">Film</label>
        <input type="radio" name="type" id="tv" value="tv" class="mr-1">
        <label for="tv">Tv Series</label>
        </div>
        </form>
        `);
        const addForm = document.querySelector('#addForm');
        // Send Entry Form
        addForm.addEventListener('submit', e => {
            e.preventDefault();
            const entryValues = {
                type: e.target.type.value,
                title: e.target.entryTitle.value
            }
            newData.getFilm(entryValues)
                .then(data => {
                    container.removeChild(container.children[1]);
                    myWatchlist.addEntry(data)
                })
                .catch(err => console.log(err))
        })
    }
    if (e.target.id === "deleteArea" || e.target.parentElement.id === "deleteArea") {
        const entry = e.target.closest('#filmCover').parentElement;
        myWatchlist.deleteEntry(entry)
        entry.remove()
    }
})

// || e.target.parentElement.id === "deleteArea"
// if (container.childElementCount === 0) {
//     container.innerHTML = `
//     <div class="fixed inset-0 flex flex-col justify-center text-center col-span-full row-span-full">
//     <h1 class="font-medium text-2xl">Hey, Welcome to your personal Watchlist!</h1>
//     <p class="text-lg">To get started, just add a new film or tv show</p>
//     </div>
//     `;
// }
const editBtn = document.querySelector('#edit')
const saveEditBtn = document.querySelector('#saveEdit')
editBtn.addEventListener('click', () => myList.EnterEditMode(myList.films), true);
saveEditBtn.addEventListener('click', () => myList.ExitEditMode(myList.films), true);



section.addEventListener('scroll', () => {
    let triggerHeigh = section.scrollTop + section.offsetHeight;
    if (triggerHeigh >= section.scrollHeight) {
        console.log('hello')
        myWatchlist.getNextDocuments(data => {
            newData.getFilm(data)
                .then((result) => myList.render(result))
                .catch(err => console.log(err))
        });
    }
});
