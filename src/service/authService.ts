import {ResBody, UserInterface} from "../type/SchemaTypes";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import {refreshTokenArray, userArray} from "../db/db";
import express from "express";
import {CustomResponse} from "../util/custom.response";
import * as UserService from "../service/userService"

export const handleLogin = (phoneNumber:string,res:express.Response) => {

    try {
        //find user in db
        let user:UserInterface|null =UserService.findUser(phoneNumber);

        if (user){

            //generate access token & refresh token send response
            generateResponseWithTokens(res,user);

        }else {

            res.status(404).send(
                new CustomResponse(
                    404,
                    'User not found'
                ));
        }
    }catch (error){
        console.log(error)
        res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }
}

export const handleNewAccessToken = (refreshToken:string,res:express.Response) => {

    try {

        //check token is exists
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

    }catch (error){
        console.log(error)
        res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }

}

//generate access token & refresh token send response
export const generateResponseWithTokens = (res:express.Response,user:UserInterface) => {
    try {

        //get access token
        let accessToken:string = generateAccessToken(user);

        // creat refresh token
        const refreshToken:string = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret);

        //save refresh token to db
        refreshTokenArray.push(refreshToken);


        res.status(200).send(
            new CustomResponse(
                200,
                "Token Created",
                {
                    user:user,
                    accessToken:accessToken,
                    refreshToken:refreshToken
                }
            )
        )

        return {
            user:user,
            accessToken:accessToken,
            refreshToken:refreshToken
        }

    }catch (error){
        console.log(error)
        res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }
}


//generate new access token
const generateAccessToken = (user:UserInterface) => {

    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET as Secret, {expiresIn: '1w'});

}

export const handleLogout = (req:any,res:express.Response,next:express.NextFunction) => {

    try {

        if (req.body.token){
            if (refreshTokenArray.includes(req.body.token)){
                //delete refresh token from db
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

    }catch (error){
        console.log(error)
        return res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }


}

