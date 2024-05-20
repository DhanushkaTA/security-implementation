import express from "express";
import {CustomResponse} from "../util/custom.response";
import otpGenerator from 'otp-generator'
import {OtpInterface} from "../type/SchemaTypes";
import {otpArray, userArray} from "../db/db";
import bcrypt, {hash} from "bcryptjs"
import * as AuthService from "./authService";
import process from "process";

export const sentOTP = async (req:express.Request,res:express.Response,next:express.NextFunction) => {
    try {

        if (!req.params.phoneNumber){
            return res.status(404).send(
                new CustomResponse(404,`Phone number not found!`)
            )
        }

        //generate new otp number
        let otp: string = otpGenerator.generate(5,{
            digits:true,
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });


        let hashOtp:string = await bcrypt.hash(otp,10,);

        const newOtp:OtpInterface = {
            phoneNumber:req.params.phoneNumber,
            otp:hashOtp
        }

        //save otp with phoneNumber in db
        otpArray.push(newOtp);

        //otp sending logic
        const accountSid = process.env.SID;
        const authToken = process.env.TW_TOKEN;

        const client = require('twilio')(accountSid, authToken);

        let message = await client.messages
            .create({
                body: `Welcome your OTP is ${otp}`,
                from: '+19382532592',
                to: '+94725337676'
            });

        console.log(message)

        res.status(200).send(
            new CustomResponse(200,`OTP SEND SUCCESSFULLY ${otp}`)
        )

    }catch (error){
        console.log(error)
        return res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }
}

export const verifyOtp = async (req:express.Request,res:express.Response,next:express.NextFunction) =>{
    try {

        if (!req.body.otp){
            return res.status(404).send(
                new CustomResponse(404,`OTP not found!`)
            )
        }

        //receive otp objects sent by phone number
        let filteredOtp: OtpInterface[] =
            otpArray.filter(value => value.phoneNumber === req.body.phoneNumber);

        if(filteredOtp.length !== 0){
            //check otp is correct
            let isEqual =
                await bcrypt.compare(req.body.otp,filteredOtp[filteredOtp.length-1].otp);

            if (isEqual){
                let res_body =
                    AuthService.generateTokens(res,{phoneNumber:req.body.phoneNumber});

                //save to db
                userArray.push({phoneNumber:req.body.phoneNumber});

                return res.status(200).send(
                    new CustomResponse(
                        200,
                        "Successful",
                        res_body
                    ));
            }else {
                return res.status(403).send(
                    new CustomResponse(403,`Invalid OTP!! `)
                )
            }

        }else {
            return res.status(404).send(
                new CustomResponse(404,`OTP Not found or expired`)
            )
        }

        //we can set otp expired msg

    }catch (error){
        console.log(error)
        return res.status(500).send(
            new CustomResponse(500,`Error ${error}`)
        )
    }
}