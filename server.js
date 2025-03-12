const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = {}; // Temporary in-memory storage

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
app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Store user in-memory (Temporary, use DB in production)
  users[email] = { password, firstName, lastName };

  console.log(`User registered: ${email}`);

  // Send credentials to Shopify App via App Proxy
  const response = await fetch(`${process.env.SHOPIFY_STORE_URL}/apps/authproxy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      actionType: "createShopifyCustomer",
      email,
      firstName,
      lastName,
    }),
  });

  const data = await response.json();
  if (data.success) {
    res.send(`<h2>Signup Successful!</h2><p>Welcome, ${data.data.customerCreate.customer.email}. Your Shopify account is created.</p>`);
  } else {
    res.send(`<h2>Signup Failed</h2><p>Something went wrong.</p>`);
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Signup Server running at http://localhost:${PORT}`));

