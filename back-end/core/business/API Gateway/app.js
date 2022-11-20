// API GATEWAY
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const morgan = require("morgan");
const axios = require('axios')
const  { Proxy } = require('axios-express-proxy');
const app = express();
const setupLogging = (app) => {
    app.use(morgan('combined'));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
    [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ]
  ]}))
// setupLogging(app);

const ROUTES = {
    //user business layer
    'login_POST':{
        needsAuth: false,
        roles: [],
        service: "http://localhost:3002/login"
    },
    'signup_POST':{
        needsAuth: false,
        roles: [],
        service: "http://localhost:3002/signup"
    },
    'check-token_POST':{
        needsAuth: true,
        roles:[],
        service: "http://localhost:3002/check-token"
    },
    'collect-user-data_POST':{
        needsAuth: true,
        roles: [],
        service: "http://localhost:3002/collect-user-data"
    },
    //deployment business layer
    'deploy-code_POST':{
        needsAuth: false,
        roles:[],
        service: "http://localhost:3004/deploy-code"
    },

}
let mapIndexSeparator = "_";

app.post('/:destination',async (req,res)=>{
    console.log(":destination")
    console.log("token:", req.cookies.jwt);

    let url = req.originalUrl.slice(1)
    let method = req.method;

    let mapIndex = url + mapIndexSeparator + method; 
    console.log("before:",mapIndex)
    if(ROUTES[mapIndex])
    {
        console.log("cas 1")
        // TODO:
        if(ROUTES[mapIndex].needsAuth == true)
        {
            console.log("private route")
            let token = req.cookies.jwt;
            if(!token)
            {
                return res.status(401).send("Please provide a token!")
            }
            console.log("ceva:")
            try{
                console.log("check token before post:", )
                let reps_token_check = await axios.post(
                    "http://localhost:3002/check-token",
                    {token}
                )
               console.log("token resp:",reps_token_check.data)
            }
            catch(e)
            {
                console.log("err:")
                return res.status(403).send("Wrong token!")
            }
           
        }
        try{
            console.log("route public:", ROUTES[mapIndex].service)
            Proxy(ROUTES[mapIndex].service, req, res)
            .then((el)=>{
                console.log("ok 1")
                return el
            })
            .catch((err)=>{
                console.log("err ok")
                return res.status(err.response.status).send(JSON.stringify(err.response.data))
            })
        }
        catch(e)
        {
            console.log("ERR:")
        }

        console.log("outer if")
        // console.log("SKIP auth")
        // let resp = await axios({
        //     method: method,
        //     url: ROUTES[mapIndex].service,
        //     data: {...req.body}
        //   });
        //   console.log("RESP:",resp)
        
    }
    else 
    {
        console.log("case 404")
        res.status(404).send("404")
    }
})

app.listen(3001,()=>{
    console.log("api gateway is listening at 3001")
})