// app configurations and db connection
require("dotenv").config();
require('./config/db')();


const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user');
const { protect, protectWithApiKey } = require('./controllers/middleware');
const { getMyProfile } = require('./controllers/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/.well-known/assetlinks.json", (req, res) => {
    res.status(200).send([{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "com.richardlenin.adopaw",
          "sha256_cert_fingerprints":
          ["7D:BD:10:0C:FA:7A:9A:2B:D9:DF:B5:63:1A:86:C0:04:0D:B2:C6:42:B6:2A:C3:23:F2:5A:F4:D1:CD:6B:0D:6A"]
        }
      }]);
});

app.use("*", protectWithApiKey);

app.use('/user',userRouter);
app.use('/api/getme',protect, getMyProfile);


app.get('/', (req, res) => {
    const hostname = req.headers.host;
    res.status(200).json({
        message: "Go ahead and create user at '/signup' or sign in at '/login'. You can also delete your account at '/delete' or logout at '/logout'",
        note: "You need to be logged in to access '/api', '/delete' and '/logout' endpoints." ,
        protectedEndpoints: ['/delete', '/logout', '/api'],
        links:{
            signup: {
                url: `http://${hostname}/user/signup`,
                method: "POST",
                body:['name','email','password', 'confirmPassword']
            } ,
            login: {
                url: `http://${hostname}/user/login`,
                method: "POST",
                body:["email", "password"]
            },
            logout: {
                url :`http://${hostname}/user/logout`,
                method: "GET"
            },
            delete: { 
                url: `http://${hostname}/user/delete`,
                method: "DELETE"
            },
            api: {
                url:`http://${hostname}/api`,
                method: "GET"
            }
        }
    });
})

// added a protected route for testing
app.get('/api',protect,(req,res)=>{
    const hostname = req.headers.host;
    res.status(200).json({
        message: `Hello ${req.user.name}. This Page is personal to you.`,
        links:{
            logout: {
                url:`http://${hostname}/user/logout`,
                method: "GET"
            },
            delete: {
                url:`http://${hostname}/user/delete`,
                method: "DELETE"
            }
        }
    })
})


app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})
