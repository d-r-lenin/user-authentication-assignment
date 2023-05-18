// app configurations and db connection
require("dotenv").config();
require('./config/db')();


const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user');
const { protect } = require('./controllers/middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/user', userRouter);


app.get('/', (req, res) => {
    const hostname = req.headers.host;
    res.status(200).json({
        message: "Go ahead and create user at '/signup' or sign in at '/login'. You can also delete your account at '/delete' or logout at '/logout'",
        note: "You need to be logged in to access '/api', '/delete' and '/logout' endpoints." ,
        protectedEndpoints: ['/delete', '/logout', '/api'],
        links:{
            signup: `http://${hostname}/user/signup`,
            login: `http://${hostname}/user/login`,
            logout: `http://${hostname}/user/logout`,
            delete: `http://${hostname}/user/delete`,
            api: `http://${hostname}/api`,
        }
    });
})

// added a protected route for testing
app.get('/api',protect,(req,res)=>{
    const hostname = req.headers.host;
    res.status(200).json({
        message: `Hello ${req.user.name}. This Page is personal to you.`,
        links:{
            logout: `http://${hostname}/user/logout`,
            delete: `http://${hostname}/user/delete`,
        }
    })
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})