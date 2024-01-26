const express = require("express");
const path = require("path");

// Initialization of the express app
const app = express();

// Port to be used to host the application
const port = process.env.PORT || 3000;

// Use a static middleware to serve static files (like HTML, CSS, and JS) kept at public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Get a route to render the Login.html page kept in public directory
// __dirname represents the path of static folder from root directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

// To start the server listening at port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
