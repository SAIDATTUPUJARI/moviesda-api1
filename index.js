const express = require('express');
const cors = require('cors');
const fs = require('fs');
const movies = require('./data.json');

const app = express();
const port = 8000;


app.use(cors({
    origin: '*'  // Allow requests from any origin (you can restrict this if needed)
}));
app.use(express.json());

// Fetch movies API
app.get("/api/movie", (req, res) => {
    return res.json(movies);
});

// Render movies in HTML
app.get("/movie", (req, res) => {
    const html = `
        <div>
            ${movies.map(movie => `
                <h3>${movie.title}</h3>
                <img src="${movie.img}" alt="${movie.title}" width="150">
            `).join('')}
        </div>
    `;
    res.send(html);
});

// Add a movie and update the JSON file
app.post("/admin/api/movie", (req, res) => {
    const body = req.body;

    if (!body.title || !body.img || !body.link) {
        return res.status(400).json({ message: "Please provide title, img, and link" });
    }

    const newMovie = { id: movies.length + 1, ...body };
    movies.push(newMovie);

    // Save the updated data to JSON
    fs.writeFile('./data.json', JSON.stringify(movies, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to save movie" });
        }
        res.status(201).json(newMovie);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
