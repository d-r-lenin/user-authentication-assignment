// app configurations and db connection
require("dotenv").config();
require('./config/db')();


const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Go ahead and create user at '/signup' or sign in at '/login'. You can also delete your account at '/delete' or logout at '/logout'",
        note: "You need to be logged in to access '/api', '/delete' and '/logout' endpoints",
        protectedEndpoints: ['/delete', '/logout', '/api']
    });
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})