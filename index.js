let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");


// Function to fetch data from API
let getMovies = () => {
    let movieName = movieNameRef.value;
    let url = `https://www.omdbapi.com/?s=${movieName}&apikey=${key}`;
  
    // If input field is empty
    if (movieName.length <= 0) {
      result.innerHTML = `<h3 class="msg">Please enter a movie name</h3>`;
    } else {
      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          // If movies are found
          if (data.Response == "True") {
            let movies = data.Search;
            let movieList = '';
  
            movies.forEach(movie => {
              movieList += `
                <div class="movie-title">
                  ${movie.Title}
                </div>`;
            });
  
            result.innerHTML = movieList;
  
            // Add event listeners to movie title elements
            let movieTitles = document.getElementsByClassName("movie-title");
            Array.from(movieTitles).forEach((title) => {
              title.addEventListener("click", () => {
                getMovie(title.textContent);
              });
            });
  
          } else {
            result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
          }
  
          // Clear movieNameRef value after search
          movieNameRef.value = "";
        })
        // If an error occurs
        .catch(() => {
          result.innerHTML = `<h3 class="msg">Error Occurred</h3>`;
        });
    }
  };
  
  searchBtn.addEventListener("click", getMovies);
  movieNameRef.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      getMovies();
    }
  });
  window.addEventListener("load", getMovies);
  
  function getMovie(movieTitle) {
    let url = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${key}`;
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // If movie exists in the database
        if (data.Response == "True") {
          result.innerHTML = `
            <div class="info">
              <img src="${data.Poster}" class="poster">
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
            <button id="imdb-btn">Watch On IMDB</button>
          `;
  
          // Add a click event listener to the "Watch Trailer" button
          let trailerBtn = document.getElementById("trailer-btn");
          trailerBtn.addEventListener("click", () => {
            getMovieTrailer(data.Title);
          });
  
          // Add a click event listener to the "Watch On IMDB" button
          let imdbBtn = document.getElementById("imdb-btn");
          imdbBtn.addEventListener("click", () => {
            // Get the IMDb ID of the movie from the OMDB API response
            let imdbID = data.imdbID;
  
            // Create the IMDb URL using the IMDb ID
            let imdbUrl = `https://www.imdb.com/title/${imdbID}/`;
  
            // Open the IMDb page in a new tab
            window.open(imdbUrl, "_blank");
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
  
  function getMovieYouTube(movieTitle) {
    // Search for the movie on YouTube
    fetch(`https://www.googleapis.com/youtube/v3/search?q=${movieTitle}&key=${youtubeApiKey}&type=video`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          window.open(videoUrl, "_blank");
        } else {
          alert("No YouTube video found for this movie");
        }
      })
      .catch(() => {
        alert("Failed to fetch YouTube video");
      });
  }
  
  function openTrailerFullscreen(trailerUrl) {
    // Open the trailer in fullscreen
    window.open(trailerUrl, "_blank", "fullscreen=yes");
  }