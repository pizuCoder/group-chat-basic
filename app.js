  const express = require("express");
  const app = express();
  const fs = require("fs");
  const bodyParser = require("body-parser");
  const login = require("./login");
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());

  // set up middleware to parse request body
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(login);
  //app.js

  // ...

  // Read messages from file
  let messages = [];
  const messagesFilePath = "./messages.txt";
  if (fs.existsSync(messagesFilePath)) {
    const fileContents = fs.readFileSync(messagesFilePath, "utf-8");
    messages = JSON.parse(fileContents);
  }

  // Route handler to display messages
  app.get("/messages", (req, res) => {
    const username = req.cookies.username;
    // const messagesForUser = messages.filter((m) => m.username !== username);
    // console.log(messagesForUser)
    res.send(`
      <h1>Messages</h1>
      <ul style="list-style-type:none;">
        ${messages
          .map((m) => `<li>${m.username}: ${m.message}</li>`)
          .join("")
        }
      </ul>
      <form action="/send" method="POST">
        <input type="text" name="message" placeholder="Type your message here">
        <button type="submit">Send</button>
      </form>
    `);
  });

  // Route handler to handle sending messages
  app.post('/send', (req, res) => {
    const username = req.cookies.username;
    const message = req.body.message;
    messages.push({ username, message });
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages));
    const fileContents = fs.readFileSync(messagesFilePath, 'utf-8');
    messages = JSON.parse(fileContents);
    res.redirect('/messages');
  });

  // Middleware to set username cookie if not already set
  app.use((req, res, next) => {
    const username = req.cookies.username;
    if (!username) {
      res.cookie('username', 'Guest');
    }
    next();
  });

  // 404 error handler
  app.use((req, res, next) => {
    res.status(404).send("<h1>404, Page not found</h1>");
  });

  app.listen(3000);
