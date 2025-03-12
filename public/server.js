// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const port = 3000; // You can change the port if needed

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Path to the users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Function to read users from users.json
function readUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If the file doesn't exist or is empty, return an empty array
        return [];
    }
}

// Function to write users to users.json
function writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Signup endpoint
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    // Check if the email already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).send('Email already exists');
    }

    // Add new user to the users array
    const newUser = {
        email,
        password,
        timestamp: new Date().toISOString()
    };
    users.push(newUser);

    // Write the updated users array to users.json
    writeUsers(users);

    res.send('Signup successful');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    // Find the user with the provided email and password
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
