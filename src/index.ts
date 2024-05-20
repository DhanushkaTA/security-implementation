import dotenv from 'dotenv'
dotenv.config();

import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import UserRouts from "./route/userRoutes";
import AuthRouts from "./route/authRoutes";
import {CustomResponse} from "./util/custom.response";
import {userArray} from "./db/db";
import {UserInterface} from "./type/SchemaTypes";

let app = express();

app.use(express.static('src/media'))

app.use(cors({
    origin: "*",
    methods:"*"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------------------------

//testing data for till connect db
let users:UserInterface[] = [
    {name:"Ranil",phoneNumber:"0700000000",role:"user",email:"ranil@gmail.com",image:"img-1.png"},
    {name:"Saman",phoneNumber:"0770000000",role:"user",email:"saman@gmail.com",image:"img-1.png"},
    {name:"Mahinda",phoneNumber:"0720000000",role:"admin",email:"mahinda@gmail.com",image:"img-1.png"},
    {name:"Anura",phoneNumber:"0710000000",role:"cor-admin",email:"anura@gmail.com",image:"img-1.png"}
]

users.map(value => {
    userArray.push(value)
})


//------------------Routes------------------------

app.use('/user',UserRouts)

app.use('/auth',AuthRouts)

// this should be always end of the routs
//this is for unhandled routes
app.all('*',(req:express.Request, res: express.Response, next:express.NextFunction) => {
    res.status(404).send(
        new CustomResponse(
            404,
            `Can't find ${req.originalUrl} path on the server`)
    )
})

//------------------------------------------

app.listen(9000, () => {
    console.log("Server start on port 9000")
})