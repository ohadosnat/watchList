const container = document.querySelector('#EntriesWrapper');
const updateMessage = document.querySelector('#updateMessage');
const section = container.parentElement;


const watchlistRef = 'watchlist.json'

const myList = new siteUI(container);
const myWatchlist = new Watchlist(watchlistRef);
const newData = new APIdata();


// Pushing JSON data to Firestore
// myWatchlist.getLocalJSON()
//     .then((data) => myWatchlist.jsonToFirestore(data))
//     .catch(err => console.log(err));

// Renders Data - While working on the design, turn this off
myWatchlist.getDocuments(data => {
    newData.getEntryData(data)
        .then((result) => myList.render(result))
        .catch(err => console.log(err))
});



// EventListeners (Hover/Click)

// Entry Hover Event (Mouse Enter/Leave)
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
    const entryID = myList.entries.find(entry => entry.id === e.target.parentElement.id)
    if (e.target.id === "overlay") {
        boxImg.classList.remove('transform');
        if (entryID.watchStatus === false) {
            watchToggle.classList.add('opacity-0');
            setTimeout(() => {
                watchToggle.classList.remove('flex');
                watchToggle.classList.add('hidden');
            }, 300)
        }
    }
}, true);

// Watch Toggle Event
container.addEventListener('click', e => {
    const entryID = myList.entries.find(entry => entry.id === e.target.parentElement.parentElement.id);
    if (e.target.id === "watchToggle") {
        if (entryID.watchStatus) {
            e.target.classList.replace('bg-watched', 'bg-didntWatch')
            entryID.watchStatus = false
            myWatchlist.updateStatus(entryID)
        } else {
            e.target.classList.replace('bg-didntWatch', 'bg-watched')
            entryID.watchStatus = true
            myWatchlist.updateStatus(entryID)
        };
    };
}, true);

// Container Events (Add/Delete)
container.addEventListener('click', (e) => {
    // Add new Entry Event
    if (e.target.id === "addCard" || e.target.parentElement.id === "addCard") {
        if (container.children[1].id === "addForm") { container.removeChild(container.children[1]) };

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
        // Send Entry Form Event
        addForm.addEventListener('submit', e => {
            e.preventDefault();
            const entryValues = {
                type: e.target.type.value,
                title: e.target.entryTitle.value
            }
            newData.getEntryData(entryValues)
                .then(data => {
                    container.removeChild(container.children[1]);
                    myWatchlist.addEntry(data)
                })
                .catch(err => console.log(err))
        })
    }
    // Delete Entry Event
    if (e.target.id === "deleteArea" || e.target.parentElement.id === "deleteArea") {
        const entry = e.target.closest('#entryCover').parentElement;
        myWatchlist.deleteEntry(entry)
        entry.remove()
    }
});

// Edit Mode Events
const editBtn = document.querySelector('#edit')
const saveEditBtn = document.querySelector('#saveEdit')
editBtn.addEventListener('click', () => myList.EnterEditMode(myList.entries), true);
saveEditBtn.addEventListener('click', () => myList.ExitEditMode(myList.entries), true);

// Scroll Event
const scrollHandle = () => {
    let triggerHeigh = section.scrollTop + section.offsetHeight;
    if (triggerHeigh >= section.scrollHeight) {
        myWatchlist.getNextDocuments(data => {
            newData.getEntryData(data)
                .then((result) => myList.render(result))
                .catch(err => console.log(err))
        });
    }
};
section.addEventListener('scroll', scrollHandle);
