// developer.js

const movieList = document.querySelector('.movie-list');
const maxMovies = 9; // Maximum number of movies to display

// Function to fetch and display the latest movies (released in the current year)
async function fetchLatestMovies() {
    try {
        const currentYear = new Date().getFullYear(); // Get the current year
        const response = await fetch(`https://www.omdbapi.com/?s=movie&y=${currentYear}&apikey=${key}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (data.Search) {
            displayMovies(data.Search.slice(0, maxMovies)); // Limit to the first 9 movies
        } else {
            throw new Error('No movies found');
        }
    } catch (error) {
        console.error('Error:', error);
        // Display an error message if fetching data fails
        movieList.innerHTML = '<p>Error: Failed to fetch movies.</p>';
    }
}

// Function to display movie data
function displayMovies(movies) {
    movieList.innerHTML = ''; // Clear any previous content

    movies.forEach((movie, index) => {
        if (index >= maxMovies) return; // Stop after displaying 9 movies

        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        const movieImage = document.createElement('img');
        movieImage.src = movie.Poster;
        movieImage.alt = movie.Title;

        const movieTitle = document.createElement('h3');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = movie.Title;

        const movieYear = document.createElement('p');
        movieYear.classList.add('movie-year');
        movieYear.textContent = `Year: ${movie.Year}`;

        movieItem.appendChild(movieImage);
        movieItem.appendChild(movieTitle);
        movieItem.appendChild(movieYear);

        movieList.appendChild(movieItem);
    });
}

// Fetch and display the latest movies when the page loads
fetchLatestMovies();
