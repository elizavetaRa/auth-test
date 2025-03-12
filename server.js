app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send("Missing required fields");
  }

  users[email] = { password, firstName, lastName };
  console.log(`User registered: ${email}`);

  try {
    const response = await fetch("https://presents-boom.myshopify.com/apps/authproxy", {
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

