const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const path = require('path');

const server = http.createServer(app);

const errorMiddleware = require("./middleware/error");
// Config
require("dotenv").config({ path: "backend/config/config.env" });

const PORT = process.env.PORT || 4000;


app.use(express.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);



const user = require("./routes/userRoute");

app.use("/api/v1", user);


app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});





// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});


server.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});;


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

