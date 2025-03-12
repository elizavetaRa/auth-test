const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Shopify store URL and App Proxy URL (encoded directly)
const SHOPIFY_STORE_URL = "https://presents-boom.myshopify.com";
const SHOPIFY_APP_PROXY_URL = `${SHOPIFY_STORE_URL}/apps/authproxy`;

let users = {}; // In-memory storage (temporary)

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

// Handle User Registration and Send Data to Shopify App Proxy
app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Store user temporarily
  users[email] = { password, firstName, lastName };
  console.log(`User registered: ${email}`);

  try {
    // Send registration data to Shopify App Proxy
    const response = await fetch(SHOPIFY_APP_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    const data = await response.json();
    console.log("Response from Shopify App Proxy:", data);

    if (data.success) {
      res.send(`<h2>Signup Successful!</h2><p>Welcome, ${email}. Shopify has been notified.</p>`);
    } else {
      res.send(`<h2>Signup Failed</h2><p>Error from Shopify: ${JSON.stringify(data)}</p>`);
    }
  } catch (error) {
    console.error("Error sending data to Shopify:", error);
    res.status(500).send(`<h2>Signup Failed</h2><p>Internal Server Error.</p>`);
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Signup Server running at http://localhost:${PORT}`));

