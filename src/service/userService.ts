import {UserInterface} from "../type/SchemaTypes";
import {userArray} from "../db/db";
import * as AuthService from "../service/authService";
import {CustomResponse} from "../util/custom.response";
import * as OTPService from '../service/otpService'
import express from "express";


export const register = (req:express.Request,res:express.Response,next:express.NextFunction) => {


    if (!req.params.phoneNumber){
        return res.status(404).send(
            new CustomResponse(404,`Phone number not found!`)
        )
    }

    console.log(req.params.phoneNumber)

    let user:UserInterface|null = findUser(req.params.phoneNumber);

    if (user){
        let res_body =  AuthService.generateTokens(user);
        return res.status(200).send(
            new CustomResponse(
                200,
                "Successful",
                res_body
            ));
    }

    //handle otp service
    OTPService.sentOTP(req,res,next);

    // res.status(200).send(new CustomResponse(200,"Not save yet this number"));


}


export const isUserExists = (phoneNumber:string):boolean => {

    let isExists = false;

    userArray.forEach(value => {
        if(value.phoneNumber == phoneNumber){
            console.log(phoneNumber)
            isExists=true;
        }
    })

    return isExists;
}

export const findUser = (phoneNumber:string):UserInterface | null => {
    let user:UserInterface|null = null;

    //find user in db
    userArray.map(value => {
        if (value.phoneNumber==phoneNumber){
            user=value;
            return user;
        }
    })

    return user;
}