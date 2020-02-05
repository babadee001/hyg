import express from 'express';
import validator from 'express-validator';
import path from 'path';

import UsersRouter from "./routes/users";
import DataRouter from "./routes/data";

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(UsersRouter);
app.use(DataRouter);


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Amirr API'
  })
})

app.listen(port, () => {
  console.log(`server started at ${port}`);
})
