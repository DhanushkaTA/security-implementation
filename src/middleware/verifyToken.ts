import express from "express";
import {CustomResponse} from "../util/custom.response";
import jwt, {Secret} from "jsonwebtoken";
import * as process from "process";
import {UserInterface} from "../type/SchemaTypes";
import {userArray} from "../db/db";
import {promisify} from "util";
import {isUserExists} from "../service/userService";

export const verifyToken = async (req :any, res :express.Response, next: express.NextFunction) => {

    try {
        //Bearer token
        //that's why authorizationToken split from ' '(space)
        //then we can get jwt token
        let token:string|null = null;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token){
            return res.status(401).json(
                new CustomResponse(401, "Token not found")
            )
        }

        //2)check token is verified

        // @ts-ignore
        const decodedData = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET as Secret);

        //3)check user is still exists
// @ts-ignore
        console.log(isUserExists(decodedData.user.phoneNumber))

        // @ts-ignore
        let user:boolean = isUserExists(decodedData.user.phoneNumber);


        if (!user){
            return res.status(401).send(
                new CustomResponse(401,"The User no longer exists!")
            );
        }

        //4) check if user changed password after token issued

        //GRANT ACCESS TO PROTECTED ROUTE
        req.tokenData = decodedData;
        next();

    }catch (error) {
        return res.status(401).json(
            new CustomResponse(401, "Invalid Token")
        )
    }

}