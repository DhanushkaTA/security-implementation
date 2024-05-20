import {UserInterface} from "../type/SchemaTypes";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import {refreshTokenArray, userArray} from "../db/db";
import express from "express";
import {CustomResponse} from "../util/custom.response";
import * as UserService from "../service/userService"

export const handleLogin = (phoneNumber:string,res:express.Response) => {

    //find user in db
    let user:UserInterface|null =UserService.findUser(phoneNumber);

    if (user){

        let res_body = generateTokens(user);

        res.status(200).send(
            new CustomResponse(
                200,
                "Access",
                res_body
            ));
    }else {

        res.status(404).send(
            new CustomResponse(
                404,
                'User not found'
            ));
    }
}

export const handleNewAccessToken = (refreshToken:string,res:express.Response) => {

    if (refreshToken == null) {
        return res.status(404).send(
            new CustomResponse(
                404,
                "Body is empty!")
        );
    }

    //Check refresh token exist the database
    if (!refreshTokenArray.includes(refreshToken)) {
        return res.status(403).send(
            new CustomResponse(
                403,
                "Invalid token!")
        );
    }

    //Check refresh token is valued token
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET as Secret,(err:any,user:any) => {

        if (err) {
            return res.status(401).send(
                new CustomResponse(401,"Token not valued!")
            );
        }

        //request to get new access token
        let accessToken:string = generateAccessToken(user);

        res.send(
            new CustomResponse(
                201,
                "Token Created",
                {accessToken:accessToken})
        );
    })

}

export const generateTokens = (user:UserInterface) => {

    //get access token
    let accessToken = generateAccessToken(user);

    // creat refresh token
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret);

    //save refresh token to db
    refreshTokenArray.push(refreshToken);

    return   {
        user:user,
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

//generate new access token
const generateAccessToken = (user:UserInterface) => {
    return  jwt.sign({user},process.env.ACCESS_TOKEN_SECRET as Secret,{expiresIn: '1w'});
}

export const handleLogout = (req:any,res:express.Response,next:express.NextFunction) => {

    if (req.body.token){
        if (refreshTokenArray.includes(req.body.token)){
            // @ts-ignore
            refreshTokenArray = refreshTokenArray.filter(token => token !== req.body.token);

            res.status(200).send(
                new CustomResponse(200,"User logout successfully.")
            )
        } else {
            res.status(404).send(
                new CustomResponse(404,"Token Not found!")
            )
        }
    }
}

