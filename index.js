let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

// Function to fetch data from API
let getMovie = () => {
    let movieName = movieNameRef.value;
    let url = `https://www.omdbapi.com/?t=${movieName}&apikey=${key}`;
    
    // If input field is empty
    if (movieName.length <= 0) {
        result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    } else {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                // If movie exists in the database
                if (data.Response == "True") {
                    result.innerHTML = `
                        <div class="info">
                            <img src=${data.Poster} class="poster">
                            <div>
                                <h2>${data.Title}</h2>
                                <div class="rating">
                                    <img src="star-icon.svg">
                                    <h4>${data.imdbRating}</h4>
                                </div>
                                <div class="details">
                                    <span>${data.Rated}</span>
                                    <span>${data.Year}</span>
                                    <span>${data.Runtime}</span>
                                </div>
                                <div class="genre">
                                    <div>${data.Genre.split(",").join("</div><div>")}</div>
                                </div>
                            </div>
                        </div>
                        <h3>Plot:</h3>
                        <p>${data.Plot}</p>
                        <h3>Cast:</h3>
                        <p>${data.Actors}</p>
                        <button id="trailer-btn">Watch Trailer</button>
                    `;
                    
                    // Add a click event listener to the "Watch Trailer" button
                    let trailerBtn = document.getElementById("trailer-btn");
                    trailerBtn.addEventListener("click", () => {
                        getMovieTrailer(data.Title);
                    });
                } else {
                    result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
                }
            })
            // If an error occurs
            .catch(() => {
                result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
            });
    }
};

searchBtn.addEventListener("click", getMovie);
movieNameRef.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getMovie();
    }
});
window.addEventListener("load", getMovie);

function getMovieTrailer(movieTitle) {
    // Fetch the movie trailer from YouTube API
    fetch(`https://www.googleapis.com/youtube/v3/search?q=${movieTitle} trailer&key=${youtubeApiKey}&type=video`)
        .then((resp) => resp.json())
        .then((data) => {
            if (data.items.length > 0) {
                const trailerVideoId = data.items[0].id.videoId;
                const trailerUrl = `https://www.youtube.com/embed/${trailerVideoId}`;
                openTrailerFullscreen(trailerUrl);
            } else {
                alert("Trailer not found");
            }
        })
        .catch(() => {
            alert("Failed to fetch trailer");
        });
}

function openTrailerFullscreen(trailerUrl) {
    // Open the trailer in fullscreen
    window.open(trailerUrl, "_blank", "fullscreen=yes");
}
