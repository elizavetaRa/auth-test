const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = {}; // In-memory storage for testing

// Handle Shopify App Proxy requests
app.all("/", (req, res) => {
  console.log("Received request from Shopify App Proxy");

  res.json({
    success: true,
    message: "Shopify App Proxy is working!",
    shopifyRequest: req.headers,
  });
});

// Serve Signup Form
app.get("/signup", (req, res) => {
  res.send(`
    <html>
    <head><title>Sign Up</title></head>
    <body>
      <h2>Sign Up</h2>
      <form method="POST" action="/register">
        <label>Email: <input type="email" name="email" required /></label><br />
        <label>Password: <input type="password" name="password" required /></label><br />
        <label>First Name: <input type="text" name="firstName" required /></label><br />
        <label>Last Name: <input type="text" name="lastName" required /></label><br />
        <button type="submit">Register</button>
      </form>
    </body>
    </html>
  `);
});

// Handle User Registration
app.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  users[email] = { password, firstName, lastName };
  console.log(`User registered: ${email}`);

  res.send(`<h2>Signup Successful!</h2><p>Welcome, ${email}.</p>`);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Signup Server running at http://localhost:${PORT}`));


