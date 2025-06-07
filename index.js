const formEl = document.getElementById("search-form");
const watchListContainer = document.getElementById("watch-list-container");
const myWatchlist = document.getElementById("my-watchlist");

let watchList = JSON.parse(localStorage.getItem("watchlist")) || [];

function renderHtml(data){
    return `<div class="movie-info-container">
        <img src="${data.Poster !== "N/A" ? data.Poster : 'images/placeholder.png'}" alt="Movie poster"></img>
        <div>
            <div class="movie-title-rating">
                <h2>${data.Title}</h2>
                <p><span class="fa-solid fa-star>*</span>${data.Ratings[0]?.Value || "N/A"}</p>
            </div>
            <div class="movie-runtime-genre"> 
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <button class="add-watchlist-btn" data-id="${data.imdbID}"><span class="add-towatchlist">
                        +</span>watchlist <i class="fa-solid fa-circle-plus">Watchlist</i></button>
            </div>
            <p>${data.Plot}</p>
        </div>
         <hr>
    </div>`
}

formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById("search-input").value
    const searchResult = await fetch(`http://www.omdbapi.com/?apikey=ddbca71b&s=${searchInput}`)
    const data = await searchResult.json()
    renderMovieSearch(data.Search) 
})

function renderMovieSearch(movies) {
    watchListContainer.innerHTML = ""
        movies.forEach(async (movie) => {
            const response = await fetch(`http://www.omdbapi.com/?apikey=ddbca71b&i=${movie.imdbID}`)
            const data  = await response.json()
            watchListContainer.innerHTML += renderHtml(data)
        })           
}

function renderMyWatchlist() {
    if(!myWatchlist) return;
    myWatchlist.innerHTML = ""
    watchList.forEach((movie) => {
        myWatchlist.innerHTML += renderHtml(movie)
    })
}

watchListContainer.addEventListener("click", async(e) => {
    if (e.target.classList.contains("add-watchlist-btn")){
        const movieData = e.target.getAttribute("data-id")
        const response = await fetch(`http://www.omdbapi.com/?apikey=ddbca71b&i=${movieData}`)
        const data = await response.json()
        watchList.push(data)
        localStorage.setItem("watchlist", JSON.stringify(watchList))
        console.log(watchList)

    }
    if(myWatchlist) {
        renderMyWatchlist()
    }
})


