import express from "express";
import {CustomResponse} from "../util/custom.response";
import jwt, {Secret} from "jsonwebtoken";
import * as process from "process";
import {UserInterface} from "../type/SchemaTypes";
import * as AuthService from '../service/authService'
import * as OTPService from '../service/otpService'

export const loginUser = (req:express.Request,res:express.Response,next:express.NextFunction) => {
    AuthService.handleLogin(req.params.phoneNumber,res);
}


export const getNewAccessToken = (req:express.Request,res:express.Response,next:express.NextFunction) => {
    AuthService.handleNewAccessToken(req.body.token,res)
}

export const logoutUser = (req:express.Request,res:express.Response,next:express.NextFunction) => {
    AuthService.handleLogout(req,res,next);
}

export const verifyOtp = (req:express.Request,res:express.Response,next:express.NextFunction) => {
    OTPService.verifyOtp(req,res,next);
}
